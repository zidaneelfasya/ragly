'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KnowledgeBaseStepProps {
  data: any;
  setData: (data: any) => void;
}

export default function KnowledgeBaseStep({ data, setData }: KnowledgeBaseStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Validate file types and sizes
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        console.warn(`File type ${file.type} not supported for ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large (${Math.round(file.size / 1024 / 1024)}MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: formatFileSize(file.size),
        status: 'pending',
        file: file
      }));

      setData({ 
        ...data, 
        files: [...(data.files || []), ...newFiles] 
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: number) => {
    setData({
      ...data,
      files: (data.files || []).filter((file: any) => file.id !== fileId)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={18} className={getStatusColor(status)} />;
      case 'processing':
        return <Loader2 size={18} className={`${getStatusColor(status)} animate-spin`} />;
      default:
        return <FileText size={18} className={getStatusColor(status)} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* File Uploader */}
      <div>
        <Label className="text-base font-semibold block">Upload Knowledge (optional)</Label>
        <Label className="text-small font-normal mb-8 text-muted-foreground">you can change this option on dashboard menu options</Label>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all mt-4 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
          }`}
        >
          <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="font-semibold text-foreground mb-1">Drag & drop your files here</p>
          <p className="text-sm text-muted-foreground mb-4">or</p>
          <Button 
            type="button" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-4">Supported: PDF, DOCX, TXT (max 50MB each)</p>
        </div>
      </div>

      {/* File List */}
      {data.files && data.files.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {data.files.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(file.status)}
                  <div className="text-left min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium capitalize ${getStatusColor(file.status)}`}>
                    {file.status}
                  </span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Knowledge */}
      <div>
        <Label htmlFor="manual-knowledge" className="text-base font-semibold mb-2 block">
          Add Manual Knowledge
        </Label>
        <textarea
          id="manual-knowledge"
          placeholder="Paste or type knowledge base content here. Markdown is supported."
          value={data.manualKnowledge}
          onChange={(e) => setData({ ...data, manualKnowledge: e.target.value })}
          className="w-full min-h-40 p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-base"
        />
        <p className="text-xs text-muted-foreground mt-1">Useful for FAQs or quick reference information</p>
      </div>

      {/* URL Crawling */}
      <div>
        <Label htmlFor="knowledge-url" className="text-base font-semibold mb-2 block">
          Knowledge Base URL
        </Label>
        <Input
          id="knowledge-url"
          placeholder="https://example.com/docs"
          value={data.knowledgeUrl}
          onChange={(e) => setData({ ...data, knowledgeUrl: e.target.value })}
          className="text-base h-10 bg-input border-border"
        />
        <p className="text-xs text-muted-foreground mt-1">We'll crawl and extract knowledge from this URL</p>
      </div>
    </div>
  );
}
