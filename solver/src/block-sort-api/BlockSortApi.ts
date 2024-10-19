import WebSocketService from "../support/websockets/WebSocketService";

export default class BlockSortApi {
  private static instance: BlockSortApi;

  private levelState: any = null;
  private levelStateListeners: ((levelState: any) => void)[] = [];

  private constructor() {
    WebSocketService.addMessageListener((message) => {
      if ("levelState" in message) {
        this.levelState = message.levelState;
        this.levelStateListeners.forEach((listener) =>
          listener(this.levelState)
        );
        this.levelStateListeners = [];
      }
    });
  }

  public static getInstance(): BlockSortApi {
    if (!BlockSortApi.instance) {
      BlockSortApi.instance = new BlockSortApi();
    }
    return BlockSortApi.instance;
  }

  public someMethod(): void {
    console.log("Executing some method in the Singleton class.");
  }

  public getLevelState(): Promise<any> {
    if (this.levelState !== null) return this.levelState;

    return new Promise((resolve) => {
      if (this.levelState !== null) return this.levelState;
      this.levelStateListeners.push((state) => {
        resolve(state);
      });
    });
  }
}
