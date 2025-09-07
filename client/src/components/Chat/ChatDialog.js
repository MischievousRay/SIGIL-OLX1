import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Badge,
  IconButton,
  Chip
} from '@mui/material';
import {
  Close,
  Message,
  AccessTime
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';

const ChatDialog = ({ open, onClose }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchChats();
    }
  }, [open, user]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    fetchChats(); // Refresh the chat list
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user?.id);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(45, 80, 22, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#000000', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Message />
          <Typography variant="h6">
            {selectedChat ? 'Chat' : 'Messages'}
          </Typography>
        </Box>
        <IconButton 
          onClick={selectedChat ? handleBackToList : onClose}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: '100%' }}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            onBack={handleBackToList}
          />
        ) : (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">Loading chats...</Typography>
              </Box>
            ) : chats.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Message sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No conversations yet
                </Typography>
                <Typography color="text.secondary">
                  Start chatting with sellers by clicking "Chat with Seller" on product listings!
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {chats.map((chat, index) => {
                  const otherParticipant = getOtherParticipant(chat);
                  const unreadCount = chat.unreadCount?.get?.(user?.id) || 0;
                  
                  return (
                    <React.Fragment key={chat._id}>
                      <ListItem 
                        button 
                        onClick={() => handleChatSelect(chat)}
                        sx={{ 
                          py: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(45, 80, 22, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge 
                            badgeContent={unreadCount} 
                            color="error"
                            invisible={unreadCount === 0}
                          >
                            <Avatar 
                              src={otherParticipant?.avatar}
                              sx={{ 
                                backgroundColor: '#E0E0E0',
                                color: '#000000'
                              }}
                            >
                              {otherParticipant?.name?.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight={unreadCount > 0 ? 600 : 400}>
                                {otherParticipant?.name}
                              </Typography>
                              <Chip 
                                label={chat.product?.title}
                                size="small"
                                sx={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                  color: '#000000',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  fontWeight: unreadCount > 0 ? 500 : 400,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '200px'
                                }}
                              >
                                {chat.lastMessage?.content || 'No messages yet'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {chat.lastMessage?.timestamp ? formatTime(chat.lastMessage.timestamp) : ''}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < chats.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
