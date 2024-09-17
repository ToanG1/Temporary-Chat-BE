import { api, StreamInOut } from "encore.dev/api";
import { IHandshakeRequest, IMessage } from "../dtos/chat.interface";
import log from "encore.dev/log";

const connectedStreams: Map<
  string,
  StreamInOut<IMessage, IMessage>
> = new Map();

const chat = api.streamInOut<IHandshakeRequest, IMessage, IMessage>(
  {
    expose: true,
    auth: true,
    path: "/chat",
  },
  async (handshake, stream) => {
    connectedStreams.set(handshake.id, stream);
    log.info("user connected", handshake);

    try {
      for await (const chatMessage of stream) {
        for (const [key, val] of connectedStreams) {
          try {
            await val.send(chatMessage);
          } catch (err) {
            connectedStreams.delete(key);
            log.error("error sending", err);
          }
        }
      }
    } catch (err) {
      connectedStreams.delete(handshake.id);
      log.error("stream error", err);
    }

    connectedStreams.delete(handshake.id);
  }
);

export { chat };
