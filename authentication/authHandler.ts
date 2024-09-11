import { Header, Gateway, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { verifyToken } from "../user/jwt.service";

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const isAuthenticated = await verifyToken(params.authorization);
  if (!isAuthenticated) {
    throw APIError.unauthenticated("Invalid token");
  }
  return { userID: "my-user-id" };
});

export const gateway = new Gateway({
  authHandler: auth,
});
