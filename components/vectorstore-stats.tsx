// components/vectorstore-stats.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, FileText, HardDrive, Loader2 } from 'lucide-react';
import { VectorstoreInfo } from '@/types/context';
import { formatFileSize } from '@/lib/context-api';

interface VectorstoreStatsProps {
  vectorstoreInfo: VectorstoreInfo | null;
  onRebuild: () => Promise<void>;
  rebuilding: boolean;
  loading: boolean;
}

export function VectorstoreStats({ 
  vectorstoreInfo, 
  onRebuild, 
  rebuilding, 
  loading 
}: VectorstoreStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Knowledge Base Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Knowledge Base Status
        </CardTitle>
        <CardDescription>
          Current status of the vector database used by the chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={vectorstoreInfo?.exists ? "default" : "secondary"}>
            {vectorstoreInfo?.exists ? "Active" : "Not Initialized"}
          </Badge>
        </div>

        {vectorstoreInfo?.exists && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents:
              </span>
              <span className="text-sm">{vectorstoreInfo.document_count.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Database Size:
              </span>
              <span className="text-sm">{formatFileSize(vectorstoreInfo.size)}</span>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <Button
            onClick={onRebuild}
            disabled={rebuilding}
            variant="outline"
            className="w-full"
          >
            {rebuilding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <RefreshCw className="mr-2 h-4 w-4" />
            Rebuild Knowledge Base
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will reprocess all uploaded documents
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
