import jwt from "jsonwebtoken";

const createToken = (accountId: string, name: string): string => {
  return jwt.sign({ accountId, name }, "secret", {
    expiresIn: "1h",
  });
};

const createRefreshToken = (accountId: string): string => {
  return jwt.sign({ accountId }, "supersecret", {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, "secret");
};

export { createToken, createRefreshToken, verifyToken };
