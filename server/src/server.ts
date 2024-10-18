import WebSocket from "ws";

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Listen for connection events
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Handle disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
