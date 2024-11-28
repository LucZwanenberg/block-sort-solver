import { WebSocketMessage } from "./WebSocketMessage";

const URL = "ws://localhost:8080";

export default class WebSocketService {
  static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private unsentMessages: WebSocketMessage[] = [];
  private listeners: ((message: WebSocketMessage) => void)[] = [];

  private static getInstance() {
    if (!WebSocketService.instance)
      WebSocketService.instance = new WebSocketService();

    return WebSocketService.instance;
  }

  public constructor() {
    this.connect();
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessageListener = this.addMessageListener.bind(this);
  }

  private connect() {
    if (!this.socket) {
      this.socket = new WebSocket(URL);

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.unsentMessages.forEach(this.sendMessage);
        this.unsentMessages = [];
      };

      this.socket.onmessage = (event: MessageEvent) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(message));
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.socket.onclose = () => {
        console.log("WebSocket closed");
      };
    }
  }

  static sendMessage(message: WebSocketMessage) {
    WebSocketService.getInstance().sendMessage(message);
  }

  static addMessageListener(
    listener: (message: WebSocketMessage) => void,
  ): () => void {
    return WebSocketService.getInstance().addMessageListener(listener);
  }

  sendMessage(message: WebSocketMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.unsentMessages.push(message);
    }
  }

  addMessageListener(
    listener: (message: WebSocketMessage) => void,
  ): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
