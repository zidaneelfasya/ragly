'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  type: 'bot' | 'user';
  text: string;
  timestamp: string;
  decision?: string;
}

interface ChatbotTesterDialogProps {
  chatbotId: string;
  chatbotName: string;
  chatbotPersonality?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChatbotTesterDialog({
  chatbotId,
  chatbotName,
  chatbotPersonality,
  open,
  onOpenChange,
}: ChatbotTesterDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when dialog opens
  useEffect(() => {
    if (open) {
      setMessages([]);
      setError(null);
      setInput('');
    }
  }, [open]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });

    // Add user message
    const newUserMessage: Message = {
      type: 'user',
      text: userMessage,
      timestamp,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call API endpoint
      const response = await fetch(`/api/chatbots/${chatbotId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add bot response
      const botMessage: Message = {
        type: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        decision: data.decision,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      
      // Add error message as bot response
      const errorMessage: Message = {
        type: 'bot',
        text: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi. 😔',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionBadge = (decision?: string) => {
    if (!decision) return null;

    const badges: Record<string, { label: string; color: string }> = {
      NO_RAG: { label: 'Conversational', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      RAG: { label: 'Knowledge Base', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
      CLARIFY: { label: 'Clarification', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
    };

    const badge = badges[decision];
    if (!badge) return null;

    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[700px] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="text-primary-foreground" size={24} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-primary-foreground text-lg">
                {chatbotName}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 text-xs">
                Live Testing • Try your chatbot
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <Bot className="mx-auto text-muted-foreground" size={48} />
                <p className="text-sm text-muted-foreground">
                  Start a conversation with your chatbot
                </p>
                {chatbotPersonality && (
                  <p className="text-xs text-muted-foreground max-w-md">
                    Personality: {chatbotPersonality}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'user' 
                        ? 'bg-primary' 
                        : 'bg-secondary'
                    }`}>
                      {msg.type === 'user' ? (
                        <User size={16} className="text-primary-foreground" />
                      ) : (
                        <Bot size={16} className="text-secondary-foreground" />
                      )}
                    </div>
                    
                    {/* Message bubble */}
                    <div className="flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-muted text-foreground border border-border rounded-tl-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                      <div className={`flex items-center gap-2 px-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp}
                        </span>
                        {msg.type === 'bot' && getDecisionBadge(msg.decision)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary">
                      <Bot size={16} className="text-secondary-foreground" />
                    </div>
                    <div className="rounded-2xl px-4 py-2.5 text-sm bg-muted text-foreground border border-border rounded-tl-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-4">
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border p-3 bg-card rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="w-10 h-10"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is live testing using your chatbot's actual configuration and knowledge base
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
