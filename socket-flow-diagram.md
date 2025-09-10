# Socket.IO Flow Diagram Architecture

## Overview
This document describes the event flow between the React client and Node.js server using Socket.IO.

## Architecture Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SOCKET.IO ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐                    ┌─────────────────────────┐
│      REACT CLIENT       │                    │      NODE.JS SERVER     │
│   (groupChatSocket.jsx) │                    │       (server.js)       │
│                         │                    │                         │
│  ┌─────────────────┐   │                    │   ┌─────────────────┐   │
│  │   Socket Ref    │   │                    │   │   Socket.IO     │   │
│  │ (socketRef.current) │                    │   │   Instance      │   │
│  └─────────────────┘   │                    │   └─────────────────┘   │
└─────────────────────────┘                    └─────────────────────────┘
           │                                              │
           │                                              │
           ▼                                              ▼

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CONNECTION ESTABLISHMENT                              │
└─────────────────────────────────────────────────────────────────────────────────┘

CLIENT                          WEBSOCKET CONNECTION                         SERVER
  │                                      │                                      │
  │ 1. establishConnection()             │                                      │
  │    io("http://localhost:8080")       │                                      │
  │ ────────────────────────────────────▶│                                      │
  │                                      │ ────────────────────────────────────▶│
  │                                      │                                      │ 2. "connection" event
  │                                      │                                      │    console.log("new client...")
  │                                      │◀──────────────────────────────────── │
  │◀──────────────────────────────────── │                                      │ 3. emit("serverWelcome", msg)
  │ 4. on("serverWelcome", callback)     │                                      │
  │    setServerResponse(data)           │                                      │
  │                                      │                                      │

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MESSAGE FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

CLIENT                          WEBSOCKET CONNECTION                         SERVER
  │                                      │                                      │
  │ 5. sendMessage()                     │                                      │
  │    emit("clientMessage", message)    │                                      │
  │ ────────────────────────────────────▶│                                      │
  │                                      │ ────────────────────────────────────▶│
  │                                      │                                      │ 6. on("clientMessage", callback)
  │                                      │                                      │    console.log("client message...")
  │                                      │◀──────────────────────────────────── │
  │◀──────────────────────────────────── │                                      │ 7. emit("serverMessage", response)
  │ 8. on("serverMessage", callback)     │                                      │
  │    setServerResponse(data)           │                                      │
  │                                      │                                      │

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DISCONNECTION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

CLIENT                          WEBSOCKET CONNECTION                         SERVER
  │                                      │                                      │
  │ 9. closeConnection()                 │                                      │
  │    emit("clientDisconnect")          │                                      │
  │ ────────────────────────────────────▶│                                      │
  │                                      │ ────────────────────────────────────▶│
  │                                      │                                      │ 10. on("clientDisconnect", callback)
  │                                      │                                      │     console.log("client disconnected")
  │                                      │◀──────────────────────────────────── │
  │◀──────────────────────────────────── │                                      │ 11. emit("serverDisconnect", msg)
  │ 12. on("serverDisconnect", callback) │                                      │
  │     setServerResponse(data)          │                                      │
  │     socketRef.current = null         │                                      │
  │                                      │                                      │
  │ 13. disconnect()                     │                                      │
  │ ────────────────────────────────────▶│                                      │
  │                                      │ ────────────────────────────────────▶│
  │                                      │                                      │ 14. on("disconnect", callback)
  │                                      │                                      │     console.log("client disconnected naturally")
```

## Event Details

### 1. Connection Events
| Event | Source | Target | Purpose |
|-------|--------|--------|---------|
| `connection` | System | Server | Triggered when client connects |
| `serverWelcome` | Server | Client | Welcome message with socket ID |

### 2. Message Events
| Event | Source | Target | Purpose |
|-------|--------|--------|---------|
| `clientMessage` | Client | Server | Send message from client to server |
| `serverMessage` | Server | Client | Response message from server to client |

### 3. Disconnection Events
| Event | Source | Target | Purpose |
|-------|--------|--------|---------|
| `clientDisconnect` | Client | Server | Manual disconnect initiated by client |
| `serverDisconnect` | Server | Client | Server acknowledges disconnect |
| `disconnect` | System | Server | Natural disconnection (network/browser close) |

## Component Responsibilities

### Client Side (React)
```javascript
// State Management
- message: Current input message
- serverResponse: Latest server response
- socketRef: Socket connection reference

// Functions
- establishConnection(): Initialize socket connection
- sendMessage(): Send message to server
- closeConnection(): Manually disconnect
- setupEventListeners(): Configure event handlers
```

### Server Side (Node.js)
```javascript
// Socket Events Handled
- "connection": New client connection
- "clientMessage": Receive client messages
- "clientDisconnect": Handle manual disconnect
- "disconnect": Handle natural disconnect

// Responses Sent
- "serverWelcome": Welcome new connections
- "serverMessage": Acknowledge received messages
- "serverDisconnect": Confirm disconnection
```

## Connection Lifecycle

1. **Initialization**: Client calls `establishConnection()`
2. **Handshake**: Socket.IO establishes WebSocket connection
3. **Welcome**: Server sends welcome message with socket ID
4. **Active**: Client can send messages, server responds
5. **Disconnection**: Either manual (`clientDisconnect`) or natural (`disconnect`)
6. **Cleanup**: Client removes listeners and nullifies socket reference

## Error Handling & Edge Cases

- Connection failures are handled by Socket.IO retry mechanism
- Manual disconnection triggers cleanup on both sides
- Natural disconnection (browser close) only triggers server-side cleanup
- Multiple connection attempts are prevented by checking `socketRef.current`
- Message sending is protected by socket existence and message validation

## CORS Configuration

```javascript
cors: {
    origin: ["http://localhost:5173"],  // React dev server
    methods: ["GET", "POST"]
}
```

This architecture ensures reliable real-time communication between the React frontend and Node.js backend using Socket.IO's event-driven model.
