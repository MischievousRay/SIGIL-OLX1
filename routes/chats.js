const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

// @route   GET /api/chats
// @desc    Get all chats for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
    .populate('participants', 'name email avatar')
    .populate('product', 'title images price')
    .populate('lastMessage.sender', 'name')
    .sort({ 'lastMessage.timestamp': -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error while fetching chats' });
  }
});

// @route   GET /api/chats/:chatId
// @desc    Get a specific chat with messages
// @access  Private
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name email avatar')
      .populate('product', 'title images price')
      .populate('messages.sender', 'name avatar');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark messages as read for this user
    chat.messages.forEach(message => {
      if (message.sender._id.toString() !== req.user.id) {
        message.read = true;
      }
    });

    // Reset unread count for this user
    chat.unreadCount.set(req.user.id.toString(), 0);
    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Server error while fetching chat' });
  }
});

// @route   POST /api/chats
// @desc    Create or get existing chat for a product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, sellerId } = req.body;

    if (!productId || !sellerId) {
      return res.status(400).json({ message: 'Product ID and seller ID are required' });
    }

    if (sellerId === req.user.id) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      product: productId,
      participants: { $all: [req.user.id, sellerId] }
    })
    .populate('participants', 'name email avatar')
    .populate('product', 'title images price');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user.id, sellerId],
        product: productId,
        messages: [],
        unreadCount: new Map([
          [req.user.id.toString(), 0],
          [sellerId.toString(), 0]
        ])
      });

      await chat.save();
      
      // Populate the new chat
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email avatar')
        .populate('product', 'title images price');
    }

    res.json(chat);
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    res.status(500).json({ message: 'Server error while creating chat' });
  }
});

// @route   POST /api/chats/:chatId/messages
// @desc    Send a message in a chat
// @access  Private
router.post('/:chatId/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newMessage = {
      sender: req.user.id,
      content: content.trim(),
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(newMessage);
    
    // Update last message
    chat.lastMessage = {
      content: content.trim(),
      timestamp: new Date(),
      sender: req.user.id
    };

    // Increment unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== req.user.id) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    // Populate the new message for response
    const populatedChat = await Chat.findById(chat._id)
      .populate('messages.sender', 'name avatar')
      .select('messages');

    const populatedMessage = populatedChat.messages[populatedChat.messages.length - 1];

    res.json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// @route   GET /api/chats/unread-count
// @desc    Get total unread message count for user
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    });

    let totalUnread = 0;
    chats.forEach(chat => {
      const userUnread = chat.unreadCount.get(req.user.id.toString()) || 0;
      totalUnread += userUnread;
    });

    res.json({ count: totalUnread });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error while fetching unread count' });
  }
});

module.exports = router;
