import { StreamInOut } from "encore.dev/api";
import { MessageType } from "../enums/messageType.enum";

export interface IHandshakeRequest {
  roomId: string;
}

export interface IMessage {
  userId: string;
  content: string;
  type: MessageType;
}

export interface ICreateRoomRequest {
  name: string;
}

export interface ICreateRoomResponse {
  id: string;
}

export interface ICreateRoomUserRequest {
  roomId: string;
  userIds: string[];
}

export interface IChatRoom {
  roomId: string;
  connectedStreams: Map<string, StreamInOut<IMessage, IMessage>>;
}
