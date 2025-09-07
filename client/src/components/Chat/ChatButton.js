import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Chat as ChatIcon,
  Message
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ChatDialog from './ChatDialog';

const ChatButton = ({ 
  product, 
  sellerId, 
  variant = 'button', // 'button' or 'icon'
  size = 'medium',
  fullWidth = false 
}) => {
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChatClick = async (e) => {
    // Prevent event propagation to avoid triggering parent click handlers
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // You might want to show a login dialog here
      alert('Please login to start a chat');
      return;
    }

    if (user.id === sellerId) {
      alert('You cannot chat with yourself');
      return;
    }

    try {
      setLoading(true);
      
      // Create or get existing chat
      const response = await axios.post('/chats', {
        productId: product._id || product.id,
        sellerId: sellerId
      });

      console.log('Chat created/retrieved:', response.data);
      setChatDialogOpen(true);
    } catch (error) {
      console.error('Error starting chat:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      alert('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title="Chat with seller">
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleChatClick(e);
            }}
            disabled={loading || !user || user.id === sellerId}
            sx={{
              backgroundColor: '#000000',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1e3510'
              },
              '&:disabled': {
                backgroundColor: 'rgba(45, 80, 22, 0.3)'
              }
            }}
            size={size}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <ChatIcon />
            )}
          </IconButton>
        </Tooltip>

        <ChatDialog 
          open={chatDialogOpen}
          onClose={() => setChatDialogOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleChatClick(e);
        }}
        disabled={loading || !user || user.id === sellerId}
        startIcon={loading ? <CircularProgress size={20} /> : <Message />}
        fullWidth={fullWidth}
        size={size}
        sx={{
          backgroundColor: '#000000',
          color: 'white',
          borderRadius: 3,
          py: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#1e3510',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(45, 80, 22, 0.3)'
          },
          '&:disabled': {
            backgroundColor: 'rgba(45, 80, 22, 0.3)',
            color: 'rgba(255,255,255,0.5)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? 'Starting Chat...' : 'Chat with Seller'}
      </Button>

      <ChatDialog 
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
      />
    </>
  );
};

export default ChatButton;
