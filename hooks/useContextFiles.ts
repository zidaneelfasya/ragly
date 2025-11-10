// hooks/useContextFiles.ts
import { useState, useEffect } from 'react';
import { ContextAPI } from '@/lib/context-api';
import { PDFFile, VectorstoreInfo } from '@/types/context';
import { toast } from 'sonner';

export function useContextFiles() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [vectorstoreInfo, setVectorstoreInfo] = useState<VectorstoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rebuilding, setRebuilding] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const [filesData, vectorstoreData] = await Promise.all([
        ContextAPI.getPDFFiles(),
        ContextAPI.getVectorstoreInfo(),
      ]);
      setFiles(filesData);
      setVectorstoreInfo(vectorstoreData);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const result = await ContextAPI.uploadPDF(file);
      toast.success(`File ${result.filename} uploaded successfully`);
      await fetchFiles(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await ContextAPI.deletePDF(fileId);
      toast.success('File deleted successfully');
      await fetchFiles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const processFile = async (fileId: string) => {
    try {
      setProcessing(fileId);
      const result = await ContextAPI.processPDF(fileId);
      toast.success(result.message);
      await fetchFiles(); // Refresh the list
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setProcessing(null);
    }
  };

  const rebuildVectorstore = async () => {
    try {
      setRebuilding(true);
      const result = await ContextAPI.rebuildVectorstore();
      toast.success(result.message);
      await fetchFiles(); // Refresh the list
    } catch (error) {
      console.error('Error rebuilding vectorstore:', error);
      toast.error(`Failed to rebuild vectorstore: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setRebuilding(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    vectorstoreInfo,
    loading,
    uploading,
    processing,
    rebuilding,
    uploadFile,
    deleteFile,
    processFile,
    rebuildVectorstore,
    refreshFiles: fetchFiles,
  };
}
