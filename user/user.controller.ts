import { api, APIError, ErrCode } from "encore.dev/api";
import { createUser, findUser } from "./user.service";
import { send } from "../mail/mail.controller";
import { createRefreshToken, createToken } from "./jwt.service";
import { saveRefreshToken } from "./token.service";

const signup = api(
  { expose: true, method: "POST", path: "/auth/signup" },
  async (request: ICreateUserRequest): Promise<IResponse> => {
    try {
      const pwd = await createUser(request.email, request.name);

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

    const { userId, name } = await findUser(request.email, request.password);
    if (!name) {
      throw new APIError(ErrCode.InvalidArgument, "Invalid email or password");
    }

    const refreshToken = createRefreshToken(name);
    await saveRefreshToken(userId, refreshToken);

    return {
      token: createToken(name),
      refreshToken,
      name,
    };
  }
);

export { signup, login };

interface IResponse {
  code: number;
  message: string;
}

interface ICreateUserRequest {
  email: string;
  name: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  token: string;
  refreshToken: string;
  name: string;
}
