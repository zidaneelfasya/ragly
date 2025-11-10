"use client";

import { useState, useEffect } from 'react';
import { ChatHistoryItem, ChatMessage } from '@/types/chat';
import { generateThreadTitle } from '@/lib/chat-utils';

// Custom hook for managing chat threads/history
export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/threads');
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      setChatHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const refreshHistory = () => {
    fetchChatHistory();
  };

  return {
    chatHistory,
    loading,
    error,
    refreshHistory
  };
}

// Custom hook for managing messages within a thread
export function useChatMessages(threadId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadInfo, setThreadInfo] = useState<{ id: string; title: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/threads/${id}/messages`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
      setThreadInfo(data.thread);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    if (!threadId || !content.trim()) return false;

    try {
      setSending(true);
      setError(null);

      const response = await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim(), role }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Refresh messages after sending
      await fetchMessages(threadId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
      return false;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (threadId) {
      fetchMessages(threadId);
    } else {
      setMessages([]);
      setThreadInfo(null);
    }
  }, [threadId]);

  const refreshMessages = () => {
    if (threadId) {
      fetchMessages(threadId);
    }
  };

  return {
    messages,
    threadInfo,
    loading,
    error,
    sending,
    sendMessage,
    refreshMessages
  };
}

// Custom hook for creating new threads
export function useCreateThread() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = async (title?: string, firstMessage?: { content: string; role?: 'user' | 'assistant' }) => {
    try {
      setCreating(true);
      setError(null);

      // Generate title from first message if not provided
      const threadTitle = title || (firstMessage?.content ? generateThreadTitle(firstMessage.content) : undefined);

      const response = await fetch('/api/threads/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: threadTitle, firstMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to create thread');
      }

      const thread = await response.json();
      return thread;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thread');
      console.error('Error creating thread:', err);
      return null;
    } finally {
      setCreating(false);
    }
  };

  return {
    createThread,
    creating,
    error
  };
}
