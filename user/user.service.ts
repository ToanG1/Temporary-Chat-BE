import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomInt } from "node:crypto";
import { APIError, ErrCode } from "encore.dev/api";
import { ICreateUserRequest } from "../dto/user.interface";
import { ILoginRequest } from "../dto/login.interface";

const database = new SQLDatabase("user", { migrations: "./migrations" });

const createUser = async (request: ICreateUserRequest): Promise<number> => {
  const randomPwd = randomInt(100000, 999999);

  const result = await database.queryRow`
        SELECT EXISTS (SELECT * FROM USERS WHERE EMAIL = ${request.email})
    `;

  if (result?.exists || false) {
    throw new APIError(ErrCode.AlreadyExists, "Email already exist");
  }

  await database.exec`
        INSERT INTO USERS (EMAIL, NAME, PASSWORD) 
        VALUES (${request.email}, ${request.name}, ${randomPwd})
    `;

  return randomPwd;
};

const findUser = async (request: ILoginRequest) => {
  const user = await database.queryRow`
      SELECT ID, NAME FROM USERS 
      WHERE EMAIL = ${request.email} AND PASSWORD = ${request.password}
    `;
  return {
    userId: user?.id ?? undefined,
    name: user?.name ?? undefined,
  };
};

export { createUser, findUser };
