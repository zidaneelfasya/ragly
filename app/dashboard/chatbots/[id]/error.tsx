'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatbotDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Chatbot detail page error:', error);
  }, [error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-destructive" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Maaf, terjadi kesalahan
        </h2>
        <p className="text-muted-foreground mb-8">
          Terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleRefresh} className="gap-2">
            <RefreshCw size={16} />
            Muat Ulang Halaman
          </Button>
          <Button variant="outline" onClick={reset} className="gap-2">
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
