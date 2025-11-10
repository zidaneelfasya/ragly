'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContextUpload } from '@/components/context-upload';
import { VectorstoreStats } from '@/components/vectorstore-stats';
import { ContextFilesTable } from '@/components/context-files-table';
import { useContextFiles } from '@/hooks/useContextFiles';
import { RefreshCw, FileText, Database, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';



export default function ContextsPage() {
  const {
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
    refreshFiles,
  } = useContextFiles();

  return (
    <div className="container mx-auto py-6 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Context Management</h1>
          <p className="text-muted-foreground">
            Manage PDF documents that serve as knowledge base for the chatbot
          </p>
        </div>
        <Button onClick={refreshFiles} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alert for RAG system status */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Make sure your RAG API server is running for this page to work properly.
          After uploading documents, they need to be processed to be available for the chatbot.
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">
              PDF documents uploaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Files</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.filter(f => f.processed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for chatbot use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <Badge variant={vectorstoreInfo?.exists ? "default" : "secondary"}>
              {vectorstoreInfo?.exists ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vectorstoreInfo?.document_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Document chunks in database
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <ContextUpload onUpload={async (file) => { await uploadFile(file); }} uploading={uploading} />
            <VectorstoreStats
              vectorstoreInfo={vectorstoreInfo}
              onRebuild={rebuildVectorstore}
              rebuilding={rebuilding}
              loading={loading}
            />
          </div>
        </div>

        {/* Files Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                Manage your PDF documents and their processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContextFilesTable
                files={files}
                onDelete={deleteFile}
                onProcess={processFile}
                processing={processing}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">1. Upload Documents</h4>
              <p className="text-muted-foreground">
                Upload PDF files that contain the information you want the chatbot to reference. 
                Files should be relevant to your domain or use case.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Process Documents</h4>
              <p className="text-muted-foreground">
                After upload, documents need to be processed to extract text and create embeddings. 
                This happens automatically or can be triggered manually.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Rebuild Knowledge Base</h4>
              <p className="text-muted-foreground">
                Use the rebuild function to reprocess all documents if you need to update 
                the entire knowledge base or fix processing issues.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. Monitor Status</h4>
              <p className="text-muted-foreground">
                Keep track of which documents are processed and ready for use. 
                Only processed documents will be available to the chatbot.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}