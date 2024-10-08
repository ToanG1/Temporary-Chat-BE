import { IChangePasswordRequest } from "./../common/dtos/user.interface";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { getRandomValues, randomBytes, randomInt } from "node:crypto";
import { APIError, ErrCode } from "encore.dev/api";
import { ICreateUserRequest } from "../common/dtos/user.interface";
import { ILoginRequest } from "../common/dtos/login.interface";

const database = new SQLDatabase("user", { migrations: "./migrations" });

const createUser = async (request: ICreateUserRequest): Promise<number> => {
  const randomPwd = randomInt(100000, 999999);
  const accountId = request.name.replace(/\s+/g, "") + randomInt(1000, 9999);

  const result = await database.queryRow`
        SELECT EXISTS (SELECT * FROM USERS WHERE EMAIL = ${request.email})
    `;

  if (result?.exists || false) {
    throw new APIError(ErrCode.AlreadyExists, "Email already exist");
  }

  await database.exec`
        INSERT INTO USERS (EMAIL, ACCOUNT_ID, NAME, PASSWORD) 
        VALUES (${request.email}, ${accountId}, ${request.name}, ${randomPwd})
    `;

  return randomPwd;
};

const findUser = async (request: ILoginRequest) => {
  const user = await database.queryRow`
      SELECT ID, ACCOUNT_ID, NAME FROM USERS 
      WHERE EMAIL = ${request.email} AND PASSWORD = ${request.password}
    `;

  return {
    userId: user?.id ?? undefined,
    accountId: user?.account_id ?? undefined,
    name: user?.name ?? undefined,
  };
};

const changePassword = (userId: string, request: IChangePasswordRequest) => {
  database.exec`
      UPDATE USERS
      SET PASSWORD = ${request.newPassword}
      WHERE ACCOUNT_ID = ${userId} AND PASSWORD = ${request.oldPassword}
    `;
};

export { createUser, findUser, changePassword };
