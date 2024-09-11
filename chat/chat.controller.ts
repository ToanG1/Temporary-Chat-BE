import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

const chat = api(
  { expose: true, auth: true, method: "POST", path: "/chat" },
  (): Promise<IResponse> => {
    const user = getAuthData();
    return {
      code: 200,
      message: "Hello " + user.name,
    };
  }
);

export { chat };

interface IResponse {
  code: number;
  message: string;
}
