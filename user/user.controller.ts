import { api, APIError, ErrCode } from "encore.dev/api";
import { createUser, findUser, changePassword } from "./user.service";
import { send } from "../mail/mail.controller";
import { createRefreshToken, createToken } from "./jwt.service";
import { deleteRefreshToken, saveRefreshToken } from "./token.service";
import {
  IChangePasswordRequest,
  ICreateUserRequest,
} from "../common/dtos/user.interface";
import { IResponse } from "../common/dtos/common.interface";
import { ILoginRequest, ILoginResponse } from "../common/dtos/login.interface";
import { getAuthData } from "~encore/auth";

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

    await deleteRefreshToken(userId);
    await saveRefreshToken(userId, refreshToken);

    return {
      token: createToken(accountId, name),
      refreshToken,
      name,
    };
  }
);

const changeUserPassword = api(
  { expose: true, auth: true, method: "POST", path: "/auth/changePassword" },
  async (request: IChangePasswordRequest): Promise<IResponse> => {
    const userID = getAuthData()?.userID;
    if (!userID || !request.oldPassword || !request.newPassword) {
      throw new APIError(
        ErrCode.InvalidArgument,
        "Email, old password and new password are required"
      );
    }

    changePassword(userID!, request);

    return {
      code: 200,
      message: "Your password has been changed!",
    };
  }
);

export { signup, login, changeUserPassword };
