import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomInt } from "node:crypto";

const database = new SQLDatabase("user", { migrations: "./migrations" });

const createUser = async (email: string, name: string): Promise<number> => {
  const randomPwd = randomInt(100000, 999999);
  await database.exec`
        INSERT INTO USERS (EMAIL, NAME, PASSWORD) 
        VALUES (${email}, ${name}, ${randomPwd})
    `;

  return randomPwd;
};

export { createUser };
