import { useEffect, useRef, useState } from "react";

interface Message {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const useWebSockets = (url: string) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<((message: Message) => void)[]>([]);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const message: Message = JSON.parse(event.data);
      listenersRef.current.forEach((listener) => listener(message));
    };

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message: Message) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const addMessageListener = (listener: (message: Message) => void) => {
    listenersRef.current.push(listener);
    return () => {
      listenersRef.current = listenersRef.current.filter((l) => l !== listener);
    };
  };

  return {
    isConnected,
    sendMessage,
    addMessageListener,
  };
};

export default useWebSockets;
