import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { verifyToken } from "../user/jwt.service";

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const payload = await verifyToken(params.authorization);
  if (!payload) {
    throw APIError.unauthenticated("Unauthorized");
  }

  return {
    userID: payload?.accountId,
    name: payload?.name,
  };
});

export const gateway = new Gateway({
  authHandler: auth,
});
