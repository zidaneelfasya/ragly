import { useState } from 'react';

export interface RAGDocument {
  id: string;
  original_name: string;
  unique_name: string;
  path_url: string;
  upload_date: string;
  file_size: number;
  processed: boolean;
}

export interface RAGStats {
  vectorstore_status: string;
  total_documents: number;
  total_chunks: number;
  vectorstore_size: string;
  ocr_available: boolean;
}

export interface VectorstoreInfo {
  exists: boolean;
  document_count: number;
  size: number;
}

export interface SearchResult {
  content: string;
  metadata: {
    source_file: string;
    upload_timestamp: string;
  };
  score?: number;
}

export function useRAGSystem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ragApiUrl = 'http://localhost:8000/api/v1/ragly'; // Updated to use new API v1

  const uploadDocument = async (file: File, chatbotId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('auto_process', 'true');
      
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload document');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDocuments = async (chatbotId: string): Promise<RAGDocument[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch documents');
      }

      const result = await response.json();
      return result.files || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string, chatbotId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete document');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchDocuments = async (query: string, chatbotId: string, k: number = 5): Promise<SearchResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('query', query);
      formData.append('k', k.toString());

      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/query`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to search documents');
      }

      const result = await response.json();
      return result.results || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search documents';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchDocumentsByName = async (searchTerm: string, chatbotId: string, limit: number = 50, offset: number = 0): Promise<{ documents: RAGDocument[], total_count: number }> => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search_term: searchTerm,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/search?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to search documents');
      }

      const result = await response.json();
      return {
        documents: result.files || [],
        total_count: result.total_count || 0
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search documents';
      setError(errorMessage);
      return { documents: [], total_count: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentInfo = async (documentId: string, chatbotId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/file/${documentId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch document info');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch document info';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getRAGStats = async (chatbotId: string): Promise<RAGStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/status`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch RAG stats');
      }

      const result = await response.json();
      return result || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch RAG stats';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getVectorstoreInfo = async (chatbotId: string): Promise<VectorstoreInfo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/vectorestore-info`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch vectorstore info');
      }

      const result = await response.json();
      
      // Transform the API response to match VectorstoreInfo interface
      const vectorstoreInfo: VectorstoreInfo = {
        exists: result.vectorstore_status === 'active',
        document_count: result.total_chunks || 0,
        size: parseInt(result.vectorstore_size?.replace(/[^\d]/g, '') || '0') // Extract number from size string
      };
      
      return vectorstoreInfo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vectorstore info';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const rebuildVectorstore = async (chatbotId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ragApiUrl}/chatbots/${chatbotId}/documents/rebuild-vectorstore`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to rebuild vectorstore');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rebuild vectorstore';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadDocument,
    getDocuments,
    deleteDocument,
    searchDocuments,
    searchDocumentsByName,
    getDocumentInfo,
    getRAGStats,
    getVectorstoreInfo,
    rebuildVectorstore,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
