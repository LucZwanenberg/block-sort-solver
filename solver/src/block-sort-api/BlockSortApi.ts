import WebSocketService from "../support/websockets/WebSocketService";
import { Message, MessagesSchema } from "./types/MessagesSchema";
import { ApiLevelState } from "./types/LevelStateSchema";

export default class BlockSortApi {
  private levelState: ApiLevelState | null = null;
  private levelStateListeners: ((levelState: ApiLevelState) => void)[] = [];
  private webSocketService: WebSocketService<Message>;

  public constructor() {
    this.webSocketService = new WebSocketService<Message>(
      "ws://localhost:8080",
      MessagesSchema
    );

    this.webSocketService.addMessageListener((data) => {
      const result = MessagesSchema.safeParse(data);
      if (!result.success) {
        console.error(`Unexpected message format received:\n${data}`);
        return;
      }

      const message: Message = result.data;

      if ("levelState" in message) {
        const levelState: ApiLevelState = message.levelState;

        this.levelState = levelState;
        this.levelStateListeners.forEach((listener) => listener(levelState));
        this.levelStateListeners = [];
      }
    });

    this.webSocketService.sendMessage({
      type: "REQUEST_LEVEL_STATE",
    });
  }

  public getLevelState(): Promise<ApiLevelState> {
    return new Promise((resolve) => {
      if (this.levelState !== null) resolve(this.levelState);
      else
        this.levelStateListeners.push((state) => {
          resolve(state);
        });
    });
  }
}
