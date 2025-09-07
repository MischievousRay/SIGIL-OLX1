import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
      
      // Join user's personal room for notifications
      newSocket.emit('join-user', user.id);
      
      // Listen for new messages
      newSocket.on('new-message', (message) => {
        console.log('New message received:', message);
        // Add notification for new message
        const notification = {
          id: Date.now(),
          type: 'message',
          title: 'New Message',
          message: `New message from ${message.sender.name}`,
          timestamp: new Date(),
          read: false,
          chatId: message.chatId
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Listen for new notifications
      newSocket.on('new-notification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const joinChat = (chatId) => {
    if (socket) {
      socket.emit('join-chat', chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socket) {
      socket.emit('leave-chat', chatId);
    }
  };

  const sendMessage = (chatId, message) => {
    if (socket) {
      socket.emit('send-message', { chatId, message });
    }
  };

  const sendNotification = (userId, notification) => {
    if (socket) {
      socket.emit('send-notification', { userId, notification });
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    joinChat,
    leaveChat,
    sendMessage,
    sendNotification,
    markNotificationAsRead,
    clearAllNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
