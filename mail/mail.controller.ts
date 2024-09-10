import { api } from "encore.dev/api";
import { sendEmail } from "./mail.service";

interface CreateEmailRequest {
  to: string;
  subject: string;
  text: string;
}

const send = api({}, async (request: CreateEmailRequest): Promise<void> => {
  sendEmail(request.to, request.subject, request.text);
});

export { send };
