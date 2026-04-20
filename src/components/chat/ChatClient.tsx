'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Plus, X, Trash2, Radio } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date | string;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
  reads: { userId: string }[];
}

interface Conversation {
  id: string;
  updatedAt: Date | string;
  participants: { user: User }[];
  messages: Message[];
}

interface ChatClientProps {
  conversations: Conversation[];
  currentUserId: string;
  users: User[];
}

export default function ChatClient({
  conversations: initialConversations,
  currentUserId,
  users,
}: ChatClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    initialConversations[0]?.id || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastContent, setBroadcastContent] = useState('');
  const [selectedBroadcastUsers, setSelectedBroadcastUsers] = useState<
    string[]
  >([]);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const getOtherUser = (conv: Conversation) =>
    conv.participants.find((p) => p.user.id !== currentUserId)?.user;

  const getUnreadCount = (conv: Conversation) => {
    return conv.messages.filter(
      (m) =>
        m.senderId !== currentUserId &&
        !m.reads?.some((r) => r.userId === currentUserId)
    ).length;
  };

  // Ordenar conversaciones: primero las no leídas
  const sortedConversations = [...conversations].sort((a, b) => {
    const unreadA = getUnreadCount(a);
    const unreadB = getUnreadCount(b);
    if (unreadA > 0 && unreadB === 0) return -1;
    if (unreadA === 0 && unreadB > 0) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  useEffect(() => {
    if (!selectedConvId) return;
    fetchMessages(selectedConvId);
  }, [selectedConvId]);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (!selectedConvId) return;
    const interval = setInterval(async () => {
      try {
        await fetchMessages(selectedConvId);
      } catch {
        // silenciar errores
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConvId]);

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Actualizar lecturas en la lista
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, messages: data.slice(-1) } : c
          )
        );
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConvId || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${selectedConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      if (res.ok) {
        const message = await res.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (targetUserId: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) {
        const conv = await res.json();
        setConversations((prev) => {
          const exists = prev.find((c) => c.id === conv.id);
          if (exists) {
            setSelectedConvId(conv.id);
            return prev;
          }
          return [{ ...conv, messages: [] }, ...prev];
        });
        setSelectedConvId(conv.id);
        setShowNewChat(false);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creando conversación:', error);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta conversación?')) return;
    try {
      const res = await fetch(`/api/conversations/${convId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        if (selectedConvId === convId) {
          setSelectedConvId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error eliminando conversación:', error);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastContent.trim() || selectedBroadcastUsers.length === 0) return;
    setBroadcastLoading(true);
    try {
      const res = await fetch('/api/conversations/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserIds: selectedBroadcastUsers,
          content: broadcastContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setBroadcastContent('');
        setSelectedBroadcastUsers([]);
        setShowBroadcast(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error enviando broadcast:', error);
    } finally {
      setBroadcastLoading(false);
    }
  };

  const toggleBroadcastUser = (userId: string) => {
    setSelectedBroadcastUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isAdmin = users.length > 1;

  return (
    <div className="chat-container">
      {/* Lista conversaciones */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #EDE8E0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #EDE8E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#3D3530' }}>
            Conversaciones
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {isAdmin && (
              <button
                onClick={() => {
                  setShowBroadcast(!showBroadcast);
                  setShowNewChat(false);
                }}
                title="Mensaje masivo"
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: showBroadcast ? '#7C6BC4' : '#EDE9F8',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: showBroadcast ? 'white' : '#7C6BC4',
                }}
              >
                <Radio size={13} />
              </button>
            )}
            <button
              onClick={() => {
                setShowNewChat(!showNewChat);
                setShowBroadcast(false);
              }}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: showNewChat ? '#7C6BC4' : '#EDE9F8',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showNewChat ? 'white' : '#7C6BC4',
              }}
            >
              {showNewChat ? <X size={14} /> : <Plus size={14} />}
            </button>
          </div>
        </div>

        {/* Nueva conversación */}
        {showNewChat && (
          <div
            style={{
              padding: '12px',
              borderBottom: '1px solid #EDE8E0',
              backgroundColor: '#FDFAF5',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9E8E82',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              NUEVA CONVERSACIÓN
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '150px',
                overflowY: 'auto',
              }}
            >
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleStartConversation(user.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #EDE8E0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#EDE9F8',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#7C6BC4',
                      flexShrink: 0,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#3D3530',
                      }}
                    >
                      {user.name}
                    </p>
                    <p style={{ fontSize: '10px', color: '#9E8E82' }}>
                      {user.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje masivo */}
        {showBroadcast && (
          <div
            style={{
              padding: '12px',
              borderBottom: '1px solid #EDE8E0',
              backgroundColor: '#FDFAF5',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9E8E82',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              MENSAJE MASIVO
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '100px',
                overflowY: 'auto',
                marginBottom: '8px',
              }}
            >
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleBroadcastUser(user.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    backgroundColor: selectedBroadcastUsers.includes(user.id)
                      ? '#EDE9F8'
                      : 'white',
                    border: `1px solid ${selectedBroadcastUsers.includes(user.id) ? '#7C6BC4' : '#EDE8E0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: selectedBroadcastUsers.includes(user.id)
                        ? '#7C6BC4'
                        : '#EDE8E0',
                      flexShrink: 0,
                    }}
                  ></div>
                  <p style={{ fontSize: '12px', color: '#3D3530' }}>
                    {user.name}
                  </p>
                </button>
              ))}
            </div>
            <textarea
              value={broadcastContent}
              onChange={(e) => setBroadcastContent(e.target.value)}
              placeholder="Escribe el mensaje..."
              rows={2}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #EDE8E0',
                fontSize: '12px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '8px',
              }}
            />
            <button
              onClick={handleBroadcast}
              disabled={
                broadcastLoading ||
                !broadcastContent.trim() ||
                selectedBroadcastUsers.length === 0
              }
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#7C6BC4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {broadcastLoading
                ? 'Enviando...'
                : `Enviar a ${selectedBroadcastUsers.length} usuarios`}
            </button>
          </div>
        )}

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sortedConversations.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#9E8E82' }}>
                No tienes conversaciones
              </p>
              <p
                style={{ fontSize: '12px', color: '#C4B8B0', marginTop: '4px' }}
              >
                Pulsa + para iniciar una
              </p>
            </div>
          ) : (
            sortedConversations.map((conv) => {
              const otherUser = getOtherUser(conv);
              const lastMsg = conv.messages[0];
              const isSelected = conv.id === selectedConvId;
              const unreadCount = getUnreadCount(conv);

              return (
                <div
                  key={conv.id}
                  style={{
                    position: 'relative',
                    borderBottom: '1px solid #F5F0E8',
                  }}
                >
                  <button
                    onClick={() => setSelectedConvId(conv.id)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: isSelected
                        ? '#EDE9F8'
                        : unreadCount > 0
                          ? '#FDFAF5'
                          : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      paddingRight: '40px',
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: isSelected ? '#7C6BC4' : '#EDE9F8',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: isSelected ? 'white' : '#7C6BC4',
                        }}
                      >
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                      {unreadCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            backgroundColor: '#7C6BC4',
                            color: 'white',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: '700',
                          }}
                        >
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: unreadCount > 0 ? '700' : '600',
                          color: '#3D3530',
                          marginBottom: '2px',
                        }}
                      >
                        {otherUser?.name}
                      </p>
                      {lastMsg && (
                        <p
                          style={{
                            fontSize: '11px',
                            color: unreadCount > 0 ? '#7C6BC4' : '#9E8E82',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: unreadCount > 0 ? '600' : '400',
                          }}
                        >
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleDeleteConversation(conv.id)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C4B8B0',
                      borderRadius: '6px',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #EDE8E0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {selectedConv ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #EDE8E0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#EDE9F8',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#7C6BC4',
                }}
              >
                {getOtherUser(selectedConv)?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3D3530',
                  }}
                >
                  {getOtherUser(selectedConv)?.name}
                </p>
                <p style={{ fontSize: '11px', color: '#9E8E82' }}>
                  {getOtherUser(selectedConv)?.role}
                </p>
              </div>
            </div>

            {/* Mensajes */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto' }}>
                  <span
                    style={{
                      fontSize: '32px',
                      display: 'block',
                      marginBottom: '12px',
                    }}
                  >
                    💬
                  </span>
                  <p style={{ fontSize: '14px', color: '#9E8E82' }}>
                    Inicia la conversación
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender.id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: isMe ? 'row-reverse' : 'row',
                        gap: '8px',
                        alignItems: 'flex-end',
                      }}
                    >
                      {!isMe && (
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: '#EDE9F8',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#7C6BC4',
                            flexShrink: 0,
                          }}
                        >
                          {msg.sender.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ maxWidth: '70%' }}>
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: isMe
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                            backgroundColor: isMe ? '#7C6BC4' : '#F5F0E8',
                            color: isMe ? 'white' : '#3D3530',
                          }}
                        >
                          <p style={{ fontSize: '13px', lineHeight: '1.5' }}>
                            {msg.content}
                          </p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            justifyContent: isMe ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <p style={{ fontSize: '10px', color: '#C4B8B0' }}>
                            {format(new Date(msg.createdAt), 'HH:mm', {
                              locale: es,
                            })}
                          </p>
                          {isMe && (
                            <p
                              style={{
                                fontSize: '10px',
                                color:
                                  msg.reads && msg.reads.length > 1
                                    ? '#7C6BC4'
                                    : '#C4B8B0',
                              }}
                            >
                              {msg.reads && msg.reads.length > 1 ? '✓✓' : '✓'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #EDE8E0',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end',
              }}
            >
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje... (Enter para enviar)"
                rows={1}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #EDE8E0',
                  fontSize: '13px',
                  color: '#3D3530',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#FDFAF5',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || loading}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: newMessage.trim() ? '#7C6BC4' : '#EDE9F8',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: newMessage.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Send
                  size={16}
                  color={newMessage.trim() ? 'white' : '#C4B8B0'}
                />
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '48px' }}>💬</span>
            <p
              style={{ fontSize: '15px', fontWeight: '500', color: '#3D3530' }}
            >
              Selecciona una conversación
            </p>
            <p style={{ fontSize: '13px', color: '#9E8E82' }}>
              O inicia una nueva con el botón +
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
