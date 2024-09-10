import { api } from "encore.dev/api";
import { createUser } from "./user.service";
import { send } from "../mail/mail.controller";

const signup = api(
  { expose: true, method: "POST", path: "/auth/signup" },
  async (request: ICreateUserRequest): Promise<IResponse> => {
    const pwd = await createUser(request.email, request.name);

    send({
      to: request.email,
      subject: "Your temporary password",
      text: `Your password is ${pwd}`,
    });

    return {
      code: 200,
      message: "Your account has been created!",
    };
  }
);

export { signup };

interface IResponse {
  code: number;
  message: string;
}

interface ICreateUserRequest {
  email: string;
  name: string;
}
