import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface CreateChatbotData {
  name: string;
  model: string;
  language: string;
  isPublic: boolean;
  personality: string;
  files: any[];
  manualKnowledge: string;
  knowledgeUrl: string;
  commands: any[];
  welcomeMessage: string;
  fallbackMessage: string;
  tone: string;
  temperature: number;
}

interface CreateChatbotResponse {
  success: boolean;
  chatbot?: any;
  message?: string;
  error?: string;
}

export function useChatbot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const createChatbot = async (data: CreateChatbotData): Promise<CreateChatbotResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to create a chatbot');
      }

      // Validate required fields
      if (!data.name || !data.model) {
        throw new Error('Name and model are required');
      }

      // Call API to create chatbot
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create chatbot');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chatbot';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatbots = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chatbots');
      
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }

      const result = await response.json();
      return result.chatbots;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chatbots';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatbot = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chatbots/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot');
      }

      const result = await response.json();
      return result.chatbot;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chatbot';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateChatbot = async (id: string, data: CreateChatbotData): Promise<CreateChatbotResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to update a chatbot');
      }

      // Validate required fields
      if (!data.name || !data.model) {
        throw new Error('Name and model are required');
      }

      // Call API to update chatbot
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update chatbot');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update chatbot';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChatbot = async (id: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to delete a chatbot');
      }

      // Call API to delete chatbot
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete chatbot');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chatbot';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (files: FileList, chatbotId: string) => {
    // This will be implemented when file upload feature is added
    // For now, just return a placeholder
    return {
      success: true,
      files: Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
  };

  return {
    createChatbot,
    fetchChatbots,
    fetchChatbot,
    updateChatbot,
    deleteChatbot,
    uploadFiles,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
