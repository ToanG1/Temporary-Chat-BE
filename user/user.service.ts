import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomInt } from "node:crypto";
import { APIError, ErrCode } from "encore.dev/api";

const database = new SQLDatabase("user", { migrations: "./migrations" });

const createUser = async (email: string, name: string): Promise<number> => {
  const randomPwd = randomInt(100000, 999999);

  const result = await database.queryRow`
        SELECT EXISTS (SELECT * FROM USERS WHERE EMAIL = ${email})
    `;

  if (result?.exists || false) {
    throw new APIError(ErrCode.AlreadyExists, "Email already exist");
  }

  await database.exec`
        INSERT INTO USERS (EMAIL, NAME, PASSWORD) 
        VALUES (${email}, ${name}, ${randomPwd})
    `;

  return randomPwd;
};

const findUser = async (email: string, password: string) => {
  const user = await database.queryRow`
        SELECT ID, NAME FROM USERS WHERE EMAIL = ${email} AND PASSWORD = ${password}
    `;
  return {
    userId: user?.id ?? undefined,
    name: user?.name ?? undefined,
  };
};

export { createUser, findUser };
