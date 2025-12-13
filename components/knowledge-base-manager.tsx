'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Search, 
  RefreshCw, 
  Download,
  AlertCircle,
  CheckCircle,
  Database,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useRAGSystem, RAGDocument, RAGStats, SearchResult } from '@/hooks/useRAGSystem';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/delete-confirm-dialog';

interface KnowledgeBaseManagerProps {
  chatbotId: string;
}

export default function KnowledgeBaseManager({ chatbotId }: KnowledgeBaseManagerProps) {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [
    stats, setStats] = useState<RAGStats | null>(null);
  const [vectorstoreInfo, setVectorstoreInfo] = useState<RAGStats | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<RAGDocument[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'search' | 'stats'>('documents');
  const router = useRouter();
  const { 
    uploadDocument, 
    getDocuments, 
    deleteDocument, 
    searchDocuments, 
    searchDocumentsByName,
    getRAGStats, 
    
    rebuildVectorstore,
    isLoading, 
    error 
  } = useRAGSystem();

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, [chatbotId]);

  useEffect(() => {
    // Filter documents based on search query
    if (documentSearchQuery.trim()) {
      const filtered = documents.filter(doc => 
        doc.original_name.toLowerCase().includes(documentSearchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [documents, documentSearchQuery]);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments(chatbotId);
      setDocuments(docs);
    } catch (error) {
      toast.error('Failed to load documents');
    }
  };

  const loadStats = async () => {
    try {
      const ragStats = await getRAGStats(chatbotId);
      setStats(ragStats);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const handleRefresh = async () => {
    try {
      toast.info('Refreshing knowledge base data...');
      await Promise.all([
        loadDocuments(),
        loadStats()
      ]);
      toast.success('Knowledge base data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Refresh error:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are supported');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit as per new API
        toast.error('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadDocument(selectedFile, chatbotId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success(`Document "${selectedFile.name}" uploaded successfully`);
      setSelectedFile(null);
      setUploadProgress(0);
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Reload documents and stats
      await loadDocuments();
      await loadStats();
      
    } catch (error) {
      setUploadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      toast.error(errorMessage);
      console.error('Upload error:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string, filename: string) => {
    try {
      await deleteDocument(documentId, chatbotId);
      toast.success(`Document "${filename}" deleted successfully`);
      
      // Reload documents and stats
      await loadDocuments();
      await loadStats();
      
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await searchDocuments(searchQuery, chatbotId, 5);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info('No results found for your query');
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleRebuildVectorstore = async () => {
    try {
      toast.info('Rebuilding vectorstore... This may take a few minutes.');
      const result = await rebuildVectorstore(chatbotId);
      
      if (result.documents_processed !== undefined) {
        toast.success(
          `Vectorstore rebuilt successfully! Processed ${result.documents_processed} documents in ${result.processing_time?.toFixed(1)}s`
        );
      } else {
        toast.success('Vectorstore rebuilt successfully');
      }
      
      router.push('/dashboard/chatbots');
      // await loadStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to rebuild vectorstore';
      toast.error(errorMessage);
      console.error('Rebuild error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={20} />
          Knowledge Base Manager
        </CardTitle>
        <CardDescription>
          Upload and manage documents for your chatbot's knowledge base using RAG (Retrieval-Augmented Generation)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {(['documents', 'search', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'documents' && <FileText size={16} className="mr-2 inline" />}
              {tab === 'search' && <Search size={16} className="mr-2 inline" />}
              {tab === 'stats' && <Database size={16} className="mr-2 inline" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Upload Section */}
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
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="max-w-sm mx-auto"
                  />
                  
                  {selectedFile && (
                    <div className="bg-muted/50 rounded-lg p-4 max-w-sm mx-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={16} />
                        <span className="font-medium">{selectedFile.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(selectedFile.size)}
                      </p>
                      
                      {uploadProgress > 0 && (
                        <div className="mt-2 space-y-1">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-center">{uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading || uploadProgress > 0}
                    className="min-w-32"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Documents List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Uploaded Documents</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <DeleteConfirmDialog
                    title="Rebuild Vector Index"
                    description="Are you sure you want to rebuild the vector index? This process will rebuild all your file data that will be used in the RAG system. This may take several minutes to complete."
                    onConfirm={handleRebuildVectorstore}
                    isLoading={isLoading}
                    confirmText="Rebuild"
                    confirmButtonVariant="default"
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isLoading}
                    >
                      <Database size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Rebuild Index
                    </Button>
                  </DeleteConfirmDialog>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                      <p className="text-2xl font-bold">
                        {isLoading ? (
                          <RefreshCw size={20} className="animate-spin" />
                        ) : (
                          documents.length
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF documents uploaded</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Processed Files</p>
                      <p className="text-2xl font-bold">
                        {isLoading ? (
                          <RefreshCw size={20} className="animate-spin" />
                        ) : (
                          documents.length
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Ready for chatbot use</p>
                    </div>
                    <Database className="h-8 w-8 text-green-500" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Chunks</p>
                      <p className="text-2xl font-bold">
                        {isLoading ? (
                          <RefreshCw size={20} className="animate-spin" />
                        ) : (
                          stats?.total_chunks || 0
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Document chunks in database</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vectorstore Size</p>
                      <p className="text-2xl font-bold">
                        {isLoading ? (
                          <RefreshCw size={20} className="animate-spin" />
                        ) : (
                          stats?.vectorstore_size || "0 MB"
                        )}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant={stats?.vectorstore_status === 'active' ? "default" : "secondary"} className="text-xs">
                          {stats?.vectorstore_status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <Download className="h-8 w-8 text-orange-500" />
                  </CardContent>
                </Card>
              </div>

              {/* Document Search */}
              {documents.length > 0 && (
                <div className="mb-4">
                  <Input
                    placeholder="Search documents by name..."
                    value={documentSearchQuery}
                    onChange={(e) => setDocumentSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              )}
              
              {filteredDocuments.length === 0 && documents.length > 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No documents found matching "{documentSearchQuery}"</p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">{doc.original_name}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Added {formatDate(doc.upload_date)}</span>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(doc.file_size)}
                            </Badge>
                            
                          </div>
                        </div>
                      </div>
                      
                      <DeleteConfirmDialog
                        title="Delete Document"
                        description={`This will permanently delete "${doc.original_name}" from the knowledge base. This action cannot be undone.`}
                        onConfirm={() => handleDeleteDocument(doc.id, doc.original_name)}
                        isLoading={isLoading}
                      >
                        <Button variant="ghost" size="sm">
                          <Trash2 size={16} />
                        </Button>
                      </DeleteConfirmDialog>
                    </div>                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="search-query">Test Knowledge Base Search</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your search query..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim() || isLoading}>
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Search Results</h3>
                <div className="h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Relevance: {((result.score || 0) * 100).toFixed(1)}%</Badge>
                          <span className="text-xs text-muted-foreground">{result.metadata.source_file}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{result.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Knowledge Base Statistics</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadStats}
                disabled={isLoading}
              >
                <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="font-medium">Vectorstore Status</span>
                    </div>
                    <p className="text-2xl font-bold capitalize">{stats.vectorstore_status}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={20} className="text-blue-500" />
                      <span className="font-medium">Total Documents</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.total_documents}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={20} className="text-green-500" />
                      <span className="font-medium">Total Chunks</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.total_chunks}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Download size={20} className="text-purple-500" />
                      <span className="font-medium">Vectorstore Size</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.vectorstore_size}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={20} className="text-orange-500" />
                      <span className="font-medium">OCR Available</span>
                    </div>
                    <p className="text-sm font-medium">{stats.ocr_available ? 'Yes' : 'No'}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No statistics available</p>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle size={16} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}