'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Loader2, MessageSquare } from 'lucide-react';

interface TelegramRecentActivityProps {
  chatbotId: string;
}

export default function TelegramRecentActivity({ chatbotId }: TelegramRecentActivityProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchRecentActivity, 30000);
    return () => clearInterval(interval);
  }, [chatbotId]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chatbots/${chatbotId}/telegram-stats?timeframe=week`);
      const data = await response.json();
      
      if (data.success && data.stats.recentConversations) {
        setConversations(data.stats.recentConversations);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={18} />
            Recent Activity
          </CardTitle>
          <CardDescription>Live conversation feed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={18} />
            Recent Activity
          </CardTitle>
          <CardDescription>Live conversation feed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No recent conversations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock size={18} />
              Recent Activity
            </CardTitle>
            <CardDescription>Last {conversations.length} conversations</CardDescription>
          </div>
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto px-6 pb-4">
          <div className="space-y-3">
            {conversations.map((conv: any, index: number) => (
              <div 
                key={conv.id || index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {conv.telegram_user_id.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium">
                      User {conv.telegram_user_id.slice(-4)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                      <p className="text-xs text-blue-900 dark:text-blue-100 break-words">
                        {conv.user_message || 'No message'}
                      </p>
                    </div>
                    {conv.ai_response && (
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded">
                        <p className="text-xs text-purple-900 dark:text-purple-100 break-words line-clamp-2">
                          {conv.ai_response}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
