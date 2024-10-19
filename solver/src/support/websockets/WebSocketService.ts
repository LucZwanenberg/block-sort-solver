import WebSocket from "ws";
import { WebSocketMessage } from "./WebSocketMessage";

const URL = "ws://localhost:8080";

export default class WebSocketService {
  static instance: WebSocketService | null = null;
  private ws: WebSocket;
  private queuedMessages: WebSocketMessage[] = [];
  private listeners: ((message: WebSocketMessage) => void)[] = [];

  private static getInstance() {
    if (!WebSocketService.instance)
      WebSocketService.instance = new WebSocketService();

    return WebSocketService.instance;
  }

  public constructor() {
    this.ws = new WebSocket(URL);

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

    ws.on("message", (data: any) => {
      console.log(`Received from server: ${data}`);
      const message: WebSocketMessage = JSON.parse(data);
      this.listeners.forEach((listener) => listener(message));
    });

    ws.on("close", () => {
      console.log("Disconnected from server");
    });
  }

  static sendMessage(message: WebSocketMessage) {
    WebSocketService.getInstance().sendMessage(message);
  }

  static addMessageListener(
    listener: (message: WebSocketMessage) => void
  ): () => void {
    return WebSocketService.getInstance().addMessageListener(listener);
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.queuedMessages.push(message);
    }
  }

  addMessageListener(
    listener: (message: WebSocketMessage) => void
  ): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  closeConnection() {
    this.ws.close();
  }
}
