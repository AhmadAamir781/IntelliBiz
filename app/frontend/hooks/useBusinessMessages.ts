import { useState, useEffect } from 'react';
import { messageApi } from '../lib/api';
import { toast } from 'sonner';
import { Message } from '../lib/types';

interface Conversation {
  userId: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
}

export function useBusinessMessages(businessId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const response = await messageApi.getBusinessMessages(businessId); //TODO
      if (response.data) {
        setMessages(response.data);
        
        // Group messages by user to create conversations
        const userMessages = new Map<number, Message[]>();
        response.data.forEach(message => {
          if (!userMessages.has(message.userId)) {
            userMessages.set(message.userId, []);
          }
          userMessages.get(message.userId)?.push(message);
        });

        // Create conversations from grouped messages
        const newConversations: Conversation[] = Array.from(userMessages.entries()).map(([userId, userMessages]) => {
          const lastMessage = userMessages[userMessages.length - 1];
          const unreadCount = userMessages.filter(m => !m.isRead && !m.isFromBusiness).length;
          
          return {
            userId,
            name: lastMessage.senderName,
            avatar: undefined, // TODO: Add avatar to Message type
            lastMessage: lastMessage.content,
            unreadCount
          };
        });

        setConversations(newConversations);
      } else {
        setError(response.message || 'Failed to fetch messages');
        toast.error(response.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('An error occurred while fetching messages');
      toast.error('An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (userId: number, content: string) => {
    try {
      const response = await messageApi.sendMessage({
        businessId,
        userId,
        content,
        isFromBusiness: true
      });

      if (response.data) {
        await fetchMessages();
        toast.success('Message sent successfully');
        return response.data;
      } else {
        toast.error(response.message || 'Failed to send message');
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error('An error occurred while sending message');
      throw err;
    }
  };

  const markAsRead = async (userId: number) => {
    try {
      const unreadMessages = messages.filter(m => m.userId === userId && !m.isRead && !m.isFromBusiness);
      for (const message of unreadMessages) {
        const response = await messageApi.markAsRead(message.id);
        if (!response.data) {
          toast.error(response.message || 'Failed to mark message as read');
        }
      }
      await fetchMessages();
    } catch (err) {
      toast.error('An error occurred while marking message as read');
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      const response = await messageApi.deleteMessage(messageId);
      if (response) {
        await fetchMessages();
        toast.success('Message deleted successfully');
      } else {
        toast.error(response || 'Failed to delete message');
      }
    } catch (err) {
      toast.error('An error occurred while deleting message');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [businessId]);

  return {
    messages,
    conversations,
    loading,
    error,
    selectedConversation,
    setSelectedConversation,
    refresh: fetchMessages,
    sendMessage,
    markAsRead,
    deleteMessage
  };
} 