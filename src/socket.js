import { io } from 'socket.io-client';
import { SOCKET_URL } from './utils/URL';

// Create a unique identifier for this window/tab
const windowId = Date.now() + Math.random().toString(36).substr(2, 9);

export const socket = io(SOCKET_URL, {
    query: {
        windowId: windowId,
        userId: localStorage.getItem("userId")
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000
});

// Log connection events for debugging
socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id, 'Window ID:', windowId);
    console.log('User ID:', localStorage.getItem("userId"));
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed');
});

export { windowId };