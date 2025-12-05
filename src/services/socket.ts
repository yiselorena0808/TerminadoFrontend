import { io } from 'socket.io-client';

export const socket = io('https://unreproaching-rancorously-evelina.ngrok-free.dev', {
  transports: ['websocket', 'polling'],
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});