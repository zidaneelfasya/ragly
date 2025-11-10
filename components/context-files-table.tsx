// components/context-files-table.tsx
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DataTable } from '@/components/ui/data-table';
import { PDFFile } from '@/types/context';
import { formatFileSize, formatDate } from '@/lib/context-api';
import { 
  MoreHorizontal, 
  FileText, 
  Trash2, 
  Play, 
  CheckCircle, 
  Clock, 
  Loader2 
} from 'lucide-react';

interface ContextFilesTableProps {
  files: PDFFile[];
  onDelete: (fileId: string) => Promise<void>;
  onProcess: (fileId: string) => Promise<void>;
  processing: string | null;
  loading: boolean;
}

export function ContextFilesTable({ 
  files, 
  onDelete, 
  onProcess, 
  processing, 
  loading 
}: ContextFilesTableProps) {
  const [deletingFile, setDeletingFile] = useState<PDFFile | null>(null);

  const handleDelete = async () => {
    if (!deletingFile) return;
    
    try {
      await onDelete(deletingFile.id);
      setDeletingFile(null);
    } catch (error) {
      // Error handled in parent component
    }
  };

  const columns: ColumnDef<PDFFile>[] = [
    {
      accessorKey: 'filename',
      header: 'File',
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium">{file.filename}</div>
              <div className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'upload_date',
      header: 'Upload Date',
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {formatDate(row.getValue('upload_date'))}
          </div>
        );
      },
    },
    {
      accessorKey: 'processed',
      header: 'Status',
      cell: ({ row }) => {
        const file = row.original;
        const isProcessing = processing === file.id;
        
        if (isProcessing) {
          return (
            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing
            </Badge>
          );
        }
        
        return (
          <Badge variant={file.processed ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
            {file.processed ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Processed
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                Pending
              </>
            )}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const file = row.original;
        const isProcessing = processing === file.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(file.id)}
              >
                Copy file ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onProcess(file.id)}
                disabled={isProcessing}
              >
                <Play className="mr-2 h-4 w-4" />
                {file.processed ? 'Reprocess' : 'Process'} File
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeletingFile(file)}
                className="text-red-600"
                disabled={isProcessing}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={files}
        searchKey="filename"
        searchPlaceholder="Search files..."
      />

      <AlertDialog open={!!deletingFile} onOpenChange={(open) => !open && setDeletingFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file &quot;{deletingFile?.filename}&quot; from the system.
              This action cannot be undone and the file will be removed from the knowledge base.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete File
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
