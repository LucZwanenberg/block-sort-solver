import WebSocket from "ws";

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

const clients: WebSocket[] = [];

// Listen for connection events
wss.on("connection", (ws) => {
  console.log("Client connected");
  // Add the new client to the list of connected clients
  clients.push(ws);

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    clients.forEach((client) => {
      // Make sure the client is still open
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });
  });

  // Handle disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
