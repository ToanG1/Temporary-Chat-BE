import { api, APIError, StreamInOut } from "encore.dev/api";
import {
  IChatId,
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

const connectedStreams: Map<
  IChatId,
  StreamInOut<IMessage, IMessage>
> = new Map();

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

    const chatId: IChatId = { userId, roomId: handshake.roomId };
    connectedStreams.set(chatId, stream);

    try {
      for await (const message of stream) {
        for (const [key, val] of connectedStreams) {
          try {
            console.log(connectedStreams);
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
      connectedStreams.delete(chatId);
    }

    connectedStreams.delete(chatId);
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
