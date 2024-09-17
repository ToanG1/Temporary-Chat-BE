import { MessageType } from "../enums/messageType.enum";

export interface IHandshakeRequest {
  id: string;
}

export interface IMessage {
  roomId: string;
  userId: string;
  messageContent: string;
  messageType: MessageType;
}
