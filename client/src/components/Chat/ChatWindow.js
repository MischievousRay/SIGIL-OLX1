import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import {
  Send,
  ArrowBack,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { socket, joinChat, leaveChat, sendMessage } = useSocket();

  const formatPrice = (price) => {
    return 'INR ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    if (chat) {
      fetchMessages();
      joinChat(chat._id);
      
      return () => {
        leaveChat(chat._id);
      };
    }
  }, [chat]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      };

      socket.on('new-message', handleNewMessage);

      return () => {
        socket.off('new-message', handleNewMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/chats/${chat._id}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`/chats/${chat._id}/messages`, {
        content: newMessage.trim()
      });

      const message = response.data;
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Send via socket for real-time update
      sendMessage(chat._id, message);
      
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipant = () => {
    return chat.participants.find(p => p._id !== user?.id);
  };

  const otherParticipant = getOtherParticipant();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'rgba(45, 80, 22, 0.05)',
        borderBottom: '1px solid rgba(45, 80, 22, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBack />
          </IconButton>
          <Avatar 
            src={otherParticipant?.avatar}
            sx={{ backgroundColor: '#E0E0E0', color: '#000000' }}
          >
            {otherParticipant?.name?.charAt(0)}
          </Avatar>
          <Typography variant="h6" sx={{ color: '#000000' }}>
            {otherParticipant?.name}
          </Typography>
        </Box>
        
        {/* Product Info */}
        <Paper sx={{ 
          p: 2, 
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          border: '1px solid rgba(45, 80, 22, 0.1)'
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {chat.product?.images?.[0] && (
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: 'rgba(45, 80, 22, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={`http://localhost:5000/${chat.product.images[0]}`}
                  alt={chat.product.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {chat.product?.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" color="#000000" fontWeight={600}>
                  {formatPrice(chat.product?.price)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        backgroundColor: 'rgba(143, 188, 143, 0.02)'
      }}>
        {loading ? (
          <Typography color="text.secondary" textAlign="center">
            Loading messages...
          </Typography>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography color="text.secondary" gutterBottom>
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Box>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender._id === user?.id;
              const showTimestamp = index === 0 || 
                (new Date(message.timestamp) - new Date(messages[index - 1].timestamp)) > 300000; // 5 minutes
              
              return (
                <Box key={message._id || index} sx={{ mb: 2 }}>
                  {showTimestamp && (
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Chip 
                        label={formatTime(message.timestamp)}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(45, 80, 22, 0.1)',
                          color: '#000000',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: 1
                  }}>
                    {!isOwnMessage && (
                      <Avatar 
                        src={message.sender.avatar}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          backgroundColor: '#8FBC8F',
                          color: '#000000'
                        }}
                      >
                        {message.sender.name?.charAt(0)}
                      </Avatar>
                    )}
                    
                    <Paper sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: isOwnMessage ? '#000000' : '#F5F5F5',
                      borderRadius: 2,
                      border: isOwnMessage ? 'none' : '1px solid #E0E0E0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '& .MuiTypography-root': {
                        color: isOwnMessage ? '#FFFFFF !important' : '#000000 !important'
                      }
                    }}>
                      <Typography 
                        variant="body1"
                        sx={{
                          color: isOwnMessage ? '#FFFFFF !important' : '#000000 !important',
                          fontSize: '0.95rem',
                          lineHeight: 1.4
                        }}
                        style={{
                          color: isOwnMessage ? '#FFFFFF' : '#000000'
                        }}
                      >
                        {message.content}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTop: '1px solid rgba(45, 80, 22, 0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#E0E0E0'
                },
                '&:hover fieldset': {
                  borderColor: '#666666'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000000'
                }
              }
            }}
          />
          <IconButton 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{ 
              backgroundColor: '#000000',
              color: 'white',
              '&:hover': {
                backgroundColor: '#666666'
              },
              '&:disabled': {
                backgroundColor: '#CCCCCC',
                color: '#666666'
              }
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;
