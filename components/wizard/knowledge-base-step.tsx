'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KnowledgeBaseStepProps {
  data: any;
  setData: (data: any) => void;
}

export default function KnowledgeBaseStep({ data, setData }: KnowledgeBaseStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<any[]>([
    { id: 1, name: 'product-guide.pdf', size: '2.4 MB', status: 'completed' },
    { id: 2, name: 'faq.docx', size: '1.2 MB', status: 'processing' },
  ]);

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
    // Handle files
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
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
        <Label className="text-base font-semibold  block">Upload Knowledge (optional)</Label>
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
          <Button type="button" variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Browse Files
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Supported: PDF, DOCX, TXT (max 50MB each)</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
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
                <span className={`text-xs font-medium capitalize ${getStatusColor(file.status)}`}>
                  {file.status}
                </span>
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

      {/* Embed Button */}
      <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base">
        Embed Knowledge Base
      </Button>
    </div>
  );
}
