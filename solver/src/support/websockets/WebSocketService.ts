import WebSocket from "ws";
import { ZodSchema } from "zod";

export default class WebSocketService<MessageType> {
  private schema: ZodSchema<MessageType>;
  private ws: WebSocket;
  private queuedMessages: MessageType[] = [];
  private listeners: ((message: MessageType) => void)[] = [];

  public constructor(url: string, schema: ZodSchema<MessageType>) {
    this.schema = schema;
    this.ws = new WebSocket(url);

    this.connect(this.ws);
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessageListener = this.addMessageListener.bind(this);
  }

  private connect(ws: WebSocket) {
    ws.on("open", () => {
      console.log("Connected to the server");
      this.queuedMessages.forEach(this.sendMessage);
      this.queuedMessages = [];
    });

    ws.on("message", (data: unknown) => {
      const result = this.schema.safeParse(JSON.parse(`${data}`));

      if (!result.success) {
        console.error(`Could not parse message: ${result.error}`);
        return;
      }

      const message: MessageType = result.data;
      this.listeners.forEach((listener) => listener(message));
    });

    ws.on("close", () => {
      console.log("Disconnected from server");
    });
  }

  sendMessage(message: MessageType) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.queuedMessages.push(message);
    }
  }

  addMessageListener(listener: (message: MessageType) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  closeConnection() {
    this.ws.close();
  }
}
