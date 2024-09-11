import { api } from "encore.dev/api";

const chat = api(
  { expose: true, auth: true, method: "POST", path: "/chat" },
  (): Promise<IResponse> => {
    return {
      code: 200,
      message: "Hello world!",
    };
  }
);

export { chat };

interface IResponse {
  code: number;
  message: string;
}
