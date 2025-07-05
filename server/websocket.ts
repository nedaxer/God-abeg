import { WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initializeWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe_notifications':
            // Client wants to subscribe to notifications
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

export function getWebSocketServer(): WebSocketServer | null {
  return wss;
}

// Broadcast message to all connected clients
export function broadcast(message: any) {
  if (!wss) return;
  
  const messageStr = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(messageStr);
    }
  });
}

// Send message to specific user
export function sendToUser(userId: string, message: any) {
  if (!wss) return;
  
  const messageStr = JSON.stringify({ ...message, userId });
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1 && client.userId === userId) {
      client.send(messageStr);
    }
  });
}