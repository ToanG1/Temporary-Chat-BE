import { api } from "encore.dev/api";
import { sendEmail } from "./mail.service";
import { CreateEmailRequest } from "../dto/mail.interface";

const send = api({}, async (request: CreateEmailRequest): Promise<void> => {
  sendEmail(request.to, request.subject, request.text);
});

export { send };
