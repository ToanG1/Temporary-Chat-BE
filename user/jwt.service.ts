import jwt from "jsonwebtoken";

const createToken = (name: string): string => {
  return jwt.sign({ name }, "secret", {
    expiresIn: "1h",
  });
};

const createRefreshToken = (name: string): string => {
  return jwt.sign({ name }, "supersecret", {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, "secret");
};

export { createToken, createRefreshToken, verifyToken };
