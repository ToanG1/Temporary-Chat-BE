import { api, APIError, ErrCode } from "encore.dev/api";
import { createUser, findUser } from "./user.service";
import { send } from "../mail/mail.controller";
import { createRefreshToken, createToken } from "./jwt.service";
import { saveRefreshToken } from "./token.service";
import { ICreateUserRequest } from "../common/dtos/user.interface";
import { IResponse } from "../common/dtos/common.interface";
import { ILoginRequest, ILoginResponse } from "../common/dtos/login.interface";

const signup = api(
  { expose: true, method: "POST", path: "/auth/signup" },
  async (request: ICreateUserRequest): Promise<IResponse> => {
    try {
      const pwd = await createUser(request);

      send({
        to: request.email,
        subject: "Your temporary password",
        text: `Your password is ${pwd}`,
      });
    } catch (_) {
    } finally {
      return {
        code: 200,
        message: "Your account has been created!",
      };
    }
  }
);

const login = api(
  { expose: true, method: "POST", path: "/auth/login" },
  async (request: ILoginRequest): Promise<ILoginResponse> => {
    if (!request.email || !request.password) {
      throw new APIError(
        ErrCode.InvalidArgument,
        "Email and password are required"
      );
    }

    const { userId, accountId, name } = await findUser(request);
    if (!userId) {
      throw new APIError(ErrCode.InvalidArgument, "Invalid email or password");
    }

    const refreshToken = createRefreshToken(accountId);
    await saveRefreshToken(userId, refreshToken);

    return {
      token: createToken(accountId, name),
      refreshToken,
      name,
    };
  }
);

export { signup, login };
