import { useState } from 'react';
import { toast } from 'sonner';

interface KnowledgeBaseFile {
  id: string;
  filename: string;
  file_size: number;
  status: 'uploaded' | 'processed' | 'failed';
  created_at: string;
}

interface KnowledgeBaseStats {
  chatbot_id: string;
  total_files: number;
  total_chunks: number;
  status: string;
}

export function useKnowledgeBase(chatbotId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const uploadFile = async (file: File): Promise<{ success: boolean; file?: KnowledgeBaseFile; error?: string }> => {
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/chatbots/${chatbotId}/knowledge-base`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload file');
      }

      setUploadProgress(100);
      
      return {
        success: true,
        file: result.file
      };

    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      };
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const getFiles = async (): Promise<KnowledgeBaseFile[]> => {
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/knowledge-base`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const result = await response.json();
      return result.files || [];

    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load knowledge base files');
      return [];
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/knowledge-base?fileId=${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      return true;

    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  const getStats = async (): Promise<KnowledgeBaseStats | null> => {
    try {
      const response = await fetch(`http://localhost:8000/knowledge-base/${chatbotId}/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  };

  const rebuildKnowledgeBase = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/knowledge-base/${chatbotId}/rebuild`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to rebuild knowledge base');
      }

      toast.success('Knowledge base rebuilt successfully');
      return true;

    } catch (error) {
      console.error('Error rebuilding knowledge base:', error);
      toast.error('Failed to rebuild knowledge base');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testQuery = async (query: string): Promise<{ results: string[]; count: number } | null> => {
    try {
      const response = await fetch('http://localhost:8000/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          chatbot_id: chatbotId,
          k: 3
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to test query');
      }

      const result = await response.json();
      return {
        results: result.results,
        count: result.count
      };

    } catch (error) {
      console.error('Error testing query:', error);
      toast.error('Failed to test query');
      return null;
    }
  };

  return {
    uploadFile,
    getFiles,
    deleteFile,
    getStats,
    rebuildKnowledgeBase,
    testQuery,
    isLoading,
    uploadProgress
  };
}
