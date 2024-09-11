import { SQLDatabase } from "encore.dev/storage/sqldb";

const database = new SQLDatabase("user", { migrations: "./migrations" });

const saveRefreshToken = async (
  userId: number,
  refreshToken: string
): Promise<void> => {
  await database.exec`
        INSERT INTO TOKENS (USER_ID, TOKEN) 
        VALUES (${userId}, ${refreshToken})
    `;
};

const isRefreshTokenValid = async (
  userId: number,
  refreshToken: string
): Promise<boolean> => {
  const result = await database.queryRow`
        SELECT EXISTS (
            SELECT * FROM TOKENS 
            WHERE USER_ID = ${userId} AND TOKEN = ${refreshToken}
                AND CREATED_AT < NOW() - INTERVAL '7 days'
        )
    `;
  return result?.exists || false;
};

export { saveRefreshToken, isRefreshTokenValid };
