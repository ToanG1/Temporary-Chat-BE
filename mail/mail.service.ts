import nodemailer from "nodemailer";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const database = new SQLDatabase("mail-logs", { migrations: "./migrations" });

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "toandinh01675@gmail.com",
    pass: "NqckC5pEbVI41PLa",
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<string> => {
  const info = await transporter.sendMail({
    from: '"Temporary Chat" <toandinh01675@gmail.com>',
    to,
    subject,
    text,
  });

  saveLog(to, subject);

  return info.messageId;
};

const saveLog = (to: string, subject: string) => {
  database.exec`
        INSERT INTO MAIL_LOGS (EMAIL, SUBJECT) 
        VALUES (${to}, ${subject})
    `;
};

export { sendEmail };
