import { useEffect } from "react";

import { WebSocketMessage } from "./WebSocketMessage";
import WebSocketService from "./WebSocketService";

const useWebSocket = (listener: (message: WebSocketMessage) => void) => {
  useEffect(() => WebSocketService.addMessageListener(listener), []);

  return {
    sendMessage: WebSocketService.sendMessage,
  };
};

export default useWebSocket;
