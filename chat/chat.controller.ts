import { api, APIError, StreamInOut } from "encore.dev/api";
import {
  IChatId,
  IChatRoom,
  ICreateRoomRequest,
  ICreateRoomResponse,
  ICreateRoomUserRequest,
  IHandshakeRequest,
  IMessage,
} from "../common/dtos/chat.interface";
import {
  createMessage,
  createRoom,
  createRoomUser,
  isRoomUserValid,
} from "./chat.service";
import log from "encore.dev/log";
import { getAuthData } from "~encore/auth";

const chatRooms: IChatRoom[] = [];

const chat = api.streamInOut<IHandshakeRequest, IMessage, IMessage>(
  {
    expose: true,
    auth: true,
    path: "/chat/:roomId",
  },
  async (handshake: IHandshakeRequest, stream) => {
    const userId = getAuthData()?.userID;
    if (!userId || !(await isRoomUserValid(handshake.roomId, userId!))) {
      throw APIError.permissionDenied("Unauthorized");
    }

    if (!chatRooms.find((room) => room.roomId === handshake.roomId)) {
      chatRooms.push({
        roomId: handshake.roomId,
        connectedStreams: new Map<string, StreamInOut<IMessage, IMessage>>(),
      });
    }
    const room = chatRooms.find((room) => room.roomId === handshake.roomId)!;
    const connectedStreams = room.connectedStreams.set(userId, stream);

    try {
      for await (const message of stream) {
        for (const [key, val] of room.connectedStreams) {
          try {
            console.log(chatRooms);
            message.userId = userId!;
            createMessage(handshake.roomId, message);
            await val.send(message);
          } catch (err) {
            connectedStreams.delete(key);
          }
        }
      }
    } catch (err) {
      log.error("stream error", err);
    }
  }
);

const createChatRoom = api(
  { expose: true, auth: true, method: "POST", path: "/createRoom" },
  async (request: ICreateRoomRequest): Promise<ICreateRoomResponse> => {
    return {
      id: await createRoom(request.name),
    };
  }
);

const createChatRoomUser = api(
  { expose: true, auth: true, method: "POST", path: "/createRoomUser" },
  async (requests: ICreateRoomUserRequest): Promise<void> => {
    requests.userIds.forEach((userId) =>
      createRoomUser(requests.roomId, userId)
    );
  }
);

export { chat, createChatRoom, createChatRoomUser };
