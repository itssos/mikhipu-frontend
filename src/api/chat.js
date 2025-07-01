import SockJS from 'sockjs-client/dist/sockjs';
import { over } from 'stompjs';
import { api } from './apiHelper';

const WS_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const WS_ENDPOINT = `${WS_BASE}/ws-chat`;

let stompClient = null;
let isConnecting = false;
let onConnectCallbacks = [];
let onDisconnectCallbacks = [];

function isStompOpen() {
  return (
    stompClient &&
    stompClient.ws &&
    stompClient.ws.readyState === 1 &&
    stompClient.connected
  );
}

// Conecta al chat (devuelve una promesa)
export function connectChat() {
  // Si ya está conectado, devuelve la promesa resuelta inmediatamente
  if (isStompOpen()) return Promise.resolve(true);
  if (isConnecting) {
    // Si ya está conectando, espera el próximo connect
    return new Promise((resolve, reject) => {
      onConnectCallbacks.push(resolve);
      onDisconnectCallbacks.push(reject);
    });
  }

  isConnecting = true;
  return new Promise((resolve, reject) => {
    const socket = new SockJS(WS_ENDPOINT);
    stompClient = over(socket);

    const token = localStorage.getItem('token');

    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      frame => {
        isConnecting = false;
        stompClient.connected = true; // A veces STOMP no lo marca, lo forzamos
        resolve(true);
        // Ejecuta cualquier otro que esperaba
        onConnectCallbacks.forEach(cb => cb(true));
        onConnectCallbacks = [];
        onDisconnectCallbacks = [];
      },
      error => {
        isConnecting = false;
        if (stompClient) stompClient.connected = false;
        reject(error);
        onDisconnectCallbacks.forEach(cb => cb(error));
        onConnectCallbacks = [];
        onDisconnectCallbacks = [];
      }
    );
  });
}

// Suscripción al chat de curso
export function subscribeToCourseChat(courseId, onMessage) {
  if (!isStompOpen()) return null;
  return stompClient.subscribe(`/topic/course.${courseId}`, msg => {
    const data = JSON.parse(msg.body);
    onMessage && onMessage(data);
  });
}

// Suscripción a mensajes directos
export function subscribeToDirectChat(onMessage) {
  if (!isStompOpen()) return null;
  return stompClient.subscribe(`/user/queue/messages`, msg => {
    const data = JSON.parse(msg.body);
    onMessage && onMessage(data);
  });
}

// Enviar mensaje a curso
export function sendCourseMessage(courseId, messageObj) {
  if (!isStompOpen()) throw new Error("No conectado a WebSocket");
  stompClient.send(`/app/chat.course.${courseId}`, {}, JSON.stringify(messageObj));
}

// Enviar mensaje directo
export function sendDirectMessage(messageObj) {
  if (!isStompOpen()) throw new Error("No conectado a WebSocket");
  stompClient.send('/app/chat.direct', {}, JSON.stringify(messageObj));
}

// Desconectar el chat
export function disconnectChat() {
  if (stompClient && stompClient.ws) {
    if (stompClient.ws.readyState === 1) {
      stompClient.disconnect(() => {
        if (stompClient) stompClient.connected = false;
        stompClient = null;
        console.log("WebSocket desconectado correctamente");
      });
    } else {
      stompClient = null;
      console.log("WebSocket ya estaba cerrado, solo se limpia la instancia");
    }
  } else {
    stompClient = null;
    console.log("No hay stompClient activo al desconectar");
  }
  isConnecting = false;
  onConnectCallbacks = [];
  onDisconnectCallbacks = [];
}


// Obtener historial de mensajes (REST)
export function fetchChatHistory(params) {
  return api.get('/api/chat/history', { params });
}


/**
 * Sube un archivo al chat y retorna la URL del archivo.
 * @param {File} file Archivo a subir
 * @returns {Promise<string>} URL del archivo subido
 */
export function uploadChatFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/api/chat/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
