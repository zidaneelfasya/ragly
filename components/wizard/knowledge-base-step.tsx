'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, X, Trash2, RefreshCw, Database } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRAGSystem } from '@/hooks/useRAGSystem';
import DeleteConfirmDialog from '../delete-confirm-dialog';
// import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';

interface KnowledgeBaseStepProps {
  data: any;
  setData: (data: any) => void;
  chatbotId: string | null;
}

export default function KnowledgeBaseStep({ data, setData, chatbotId }: KnowledgeBaseStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    uploadDocument, 
    getDocuments, 
    deleteDocument,
    isLoading
  } = useRAGSystem();

  // Load documents when chatbotId is available
  useEffect(() => {
    if (chatbotId) {
      loadDocuments();
    }
  }, [chatbotId]);

  const loadDocuments = async () => {
    if (!chatbotId) return;
    
    try {
      console.log('Loading documents for chatbot:', chatbotId);
      const docs = await getDocuments(chatbotId);
      console.log('Documents loaded:', docs.length, docs);
      setDocuments(docs);
      
      if (docs.length > 0) {
        toast.success(`${docs.length} document(s) loaded`);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are supported');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are supported');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !chatbotId) {
      toast.error('Please select a file and ensure chatbot is created');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadDocument(selectedFile, chatbotId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success(`Document "${selectedFile.name}" uploaded successfully`);
      
      // Wait a bit before resetting to show 100%
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);
      
      // Reload documents
      await loadDocuments();
      
    } catch (error) {
      setUploadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      toast.error(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, filename: string) => {
    if (!chatbotId) return;
    
    try {
      await deleteDocument(documentId, chatbotId);
      toast.success(`Document "${filename}" deleted successfully`);
      await loadDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {!chatbotId && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Please complete the Basic Info step first to enable knowledge base upload.
          </p>
        </div>
      )}

      {/* Summary Card - Show document count */}
      {chatbotId && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documents Uploaded</p>
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {documents.length === 0 
                  ? 'No documents yet. Upload PDF files to build knowledge base.' 
                  : `${documents.length} document(s) ready for processing`}
              </p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
      )}

      {/* File Uploader */}
      <div>
        <Label className="text-base font-semibold block">Upload Knowledge Base (PDF)</Label>
        <Label className="text-sm font-normal mb-4 text-muted-foreground block mt-1">
          Upload PDF documents to build your chatbot's knowledge base (you can still add it later)
        </Label>

        <div className="border border-dashed border-border rounded-lg p-6">
          <div className="text-center space-y-4">
            <Upload size={48} className="mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">Upload Document</h3>
              <p className="text-sm text-muted-foreground">
                Support PDF files up to 100MB
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="max-w-sm mx-auto"
                disabled={!chatbotId || uploading}
              />
              
              {selectedFile && (
                <div className="bg-muted/50 rounded-lg p-4 max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-destructive hover:text-destructive/80"
                      disabled={uploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-center">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || !chatbotId || uploading || isLoading}
                className="min-w-32"
              >
                {uploading || isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {chatbotId && documents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Uploaded Documents</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadDocuments}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">{doc.original_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.file_size && formatFileSize(doc.file_size)} • 
                      Uploaded {formatDate(doc.upload_date)}
                    </p>
                  </div>
                </div>
                
                <DeleteConfirmDialog
                  title="Delete Document"
                  description={`This will permanently delete "${doc.original_name}" from the knowledge base. This action cannot be undone.`}
                  onConfirm={() => handleDeleteDocument(doc.id, doc.original_name)}
                  isLoading={isLoading}
                >
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                    <Trash2 size={16} />
                  </Button>
                </DeleteConfirmDialog>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Knowledge */}
      <div>
        <Label htmlFor="manual-knowledge" className="text-base font-semibold mb-2 block">
          Add Manual Knowledge (Optional)
        </Label>
        <textarea
          id="manual-knowledge"
          placeholder="Paste or type knowledge base content here. Markdown is supported."
          value={data.manualKnowledge}
          onChange={(e) => setData({ ...data, manualKnowledge: e.target.value })}
          className="w-full min-h-40 p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal text-base"
        />
        <p className="text-xs text-muted-foreground mt-1">Useful for FAQs or quick reference information</p>
      </div>
    </div>
  );
}
