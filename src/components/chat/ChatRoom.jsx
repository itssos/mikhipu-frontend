import React, { useEffect, useState, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  connectChat,
  disconnectChat,
  subscribeToCourseChat,
  subscribeToDirectChat,
  sendCourseMessage,
  sendDirectMessage,
  fetchChatHistory,
  uploadChatFile
} from '../../api/chat';

// Máximo 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function ChatRoom({ courseId = null, toUserId = null }) {
  const { user, person } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const messagesEndRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');

  // Cargar historial
  useEffect(() => {
    let filter = {};
    if (courseId) filter = { type: 'course', courseId };
    else if (toUserId) filter = { type: 'direct', userId: user.id, toUserId: toUserId };

    fetchChatHistory(filter)
      .then(hist => setMessages(hist || []))
      .catch(() => setMessages([]));
  }, [courseId, toUserId, user.id]);

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket
  useEffect(() => {
    let localSubscription = null;
    let isMounted = true;

    connectChat()
      .then(() => {
        if (!isMounted) return;
        setConnected(true);
        if (courseId) {
          localSubscription = subscribeToCourseChat(courseId, handleReceiveMessage);
        } else if (toUserId) {
          localSubscription = subscribeToDirectChat(handleReceiveMessage);
        }
        setSubscription(localSubscription);
      })
      .catch(() => {
        setConnected(false);
        localSubscription?.unsubscribe?.();
        setSubscription(null);
      });

    return () => {
      isMounted = false;
      localSubscription?.unsubscribe?.();
      setSubscription(null);
      disconnectChat();
    };
  }, [courseId, toUserId]);

  function handleReceiveMessage(msg) {
    setMessages(prev => [...prev, msg]);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!message.trim() && !file) return;

    let attachmentUrl = null, attachmentName = null, attachmentType = null;

    if (file) {
      setUploading(true);
      try {
        const resp = await uploadChatFile(file);
        attachmentUrl = resp?.url || resp; // Asegúrate de usar la propiedad correcta según tu API
        attachmentName = file.name;
        attachmentType = file.type;
      } catch (err) {
        alert("Error subiendo archivo");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const msgObj = {
      content: message.trim(),
      senderId: user?.id,
      senderName: person?.firstName + ' ' + person?.lastName,
      timestamp: new Date().toISOString(),
      attachmentUrl,
      attachmentName,
      attachmentType,
      ...(courseId ? { type: 'COURSE', courseId } : { type: 'DIRECT', toUserId })
    };

    try {
      if (courseId) sendCourseMessage(courseId, msgObj);
      else if (toUserId) sendDirectMessage(msgObj);
      setMessage('');
      setFile(null);
      setFileError('');
    } catch (error) {
      alert("No se pudo enviar el mensaje: " + error.message);
    }
  }

  // Forzar descarga de cualquier archivo
  function handleDownload(url, filename) {
    fetch(url, { credentials: 'include' })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || 'archivo';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
      });
  }

  // Renderizar archivo adjunto (descarga directa)
  function renderFile(msg) {
    if (!msg.attachmentUrl) return null;
    const backendPrefix = "http://localhost:8080";
    const url = msg.attachmentUrl.startsWith("http")
      ? msg.attachmentUrl
      : backendPrefix + msg.attachmentUrl;
    const ext = (msg.attachmentName || '').split('.').pop().toLowerCase();

    return (
      <div style={{ marginTop: 8 }}>
        <button
          type="button"
          style={{
            color: '#574d32', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            fontFamily: 'inherit', fontSize: 15, padding: 0, textDecoration: 'underline'
          }}
          onClick={() => handleDownload(url, msg.attachmentName)}
        >
          {(() => {
            if (msg.attachmentType?.startsWith('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext))
              return '🖼️ Descargar imagen';
            if (msg.attachmentType === 'application/pdf' || ext === 'pdf')
              return '📄 Descargar PDF';
            return '⬇️ Descargar archivo';
          })()} ({msg.attachmentName || 'Archivo'})
        </button>
      </div>
    );
  }

  // Limitar peso archivo y validar
  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setFile(null);
      setFileError('El archivo supera los 50 MB.');
      return;
    }
    setFile(f);
    setFileError('');
  }

  // === Render ===
  return (
    <div>
      <div className="adventure-chat">
        <div className="chat-header">
          {courseId ? '🌴 Chat del Curso' : '🌴 Chat Directo'}
        </div>

        <div className="chat-messages" id="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.senderId === user?.id ? 'right' : 'left'}`}
            >
              <b style={{
                fontSize: 14,
                color: msg.senderId === user?.id ? '#715f3a' : '#7d6424',
                letterSpacing: 1,
                fontWeight: 'bold'
              }}>{msg.senderName}</b>
              <div style={{ marginTop: 3 }}>{msg.content}</div>
              {renderFile(msg)}
              <span style={{ fontSize: 11, color: '#9b7c3a', display: 'block', marginTop: 5, textAlign: 'right' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend} autoComplete="off">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            required={!file}
            disabled={!connected || uploading}
            style={{ fontFamily: 'Pirata One, cursive' }}
            maxLength={1024}
          />

          <button
            type="submit"
            disabled={!connected || (!message.trim() && !file) || uploading}
          >
            {uploading ? 'Enviando...' : 'Enviar'}
          </button>

          {/* Botón adjuntar */}
          <label
            className="attach-btn"
            title="Adjuntar archivo"
            style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
          >
            🧭
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
              accept="*"
            />
          </label>
        </form>

        {/* Archivo seleccionado */}
        {file && (
          <div style={{
            background: '#e1c894',
            borderRadius: 9,
            margin: '0 18px 8px 18px',
            padding: '6px 14px 6px 10px',
            fontSize: 13,
            color: '#5b4d18',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span>Archivo: <b>{file.name}</b></span>
            <button type="button" onClick={() => setFile(null)}
              style={{
                background: 'none', border: 'none', color: '#a83232', cursor: 'pointer', fontWeight: 'bold', fontSize: 15
              }}>
              Quitar
            </button>
          </div>
        )}
        {/* Error archivo */}
        {fileError && (
          <div style={{
            color: '#c62828',
            background: '#fff3ed',
            border: '1.5px solid #bb6c3b',
            borderRadius: 7,
            fontWeight: 'bold',
            padding: '4px 12px',
            margin: '2px 24px 8px 24px',
            textAlign: 'center',
            fontFamily: 'Pirata One, cursive'
          }}>
            {fileError}
          </div>
        )}

        {/* Estado de conexión */}
        <div style={{
          color: connected ? '#365d16' : '#c62828',
          fontFamily: 'Press Start 2P, Pirata One, cursive, monospace',
          fontSize: 13,
          textAlign: 'center',
          marginBottom: 8,
          marginTop: 1,
          letterSpacing: 1
        }}>
          {connected
            ? '¡Conectado al chat!'
            : 'Desconectado del chat.'}
        </div>
      </div>
    </div>
  );
}
