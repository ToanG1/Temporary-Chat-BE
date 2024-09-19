import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomUUID } from "crypto";
import { IMessage } from "../common/dtos/chat.interface";

const database = new SQLDatabase("chat", { migrations: "./migrations" });

const createRoom = async (name: string) => {
  const id = randomUUID();
  await database.exec`
			INSERT INTO ROOMS (ID, NAME) VALUES (${id}, ${name})
	`;

  return id;
};

const createRoomUser = async (roomId: string, userId: string) => {
  await database.exec`
		INSERT INTO ROOM_USERS (ROOM_ID, USER_ID) 
		VALUES (${roomId}, ${userId})
	`;
};

const createMessage = (roomId: string, message: IMessage) => {
  database.exec`
		INSERT INTO MESSAGES (ROOM_ID, USER_ID, CONTENT) 
		VALUES (${roomId}, ${message.userId}, ${message.content})
	`;
};

const isRoomUserValid = async (roomId: string, userId: string) => {
  const result = await database.queryRow`
		SELECT EXISTS (
			SELECT * FROM ROOM_USERS 
			WHERE ROOM_ID = ${roomId} AND USER_ID = ${userId}
		)
	`;
  return result?.exists || false;
};

export { createRoom, createRoomUser, createMessage, isRoomUserValid };
