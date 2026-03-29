'use client';

import { useState, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface PreviewPanelProps {
  data: any;
}

interface Message {
  type: 'bot' | 'user';
  text: string;
  timestamp?: string;
}

export default function PreviewPanel({ data }: PreviewPanelProps) {
  // Initial demo conversation
  const getDemoMessages = (): Message[] => [
    { 
      type: 'bot', 
      text: data.welcomeMessage || 'Hello! How can I help you today?',
      timestamp: '10:00 AM'
    },
    { 
      type: 'user', 
      text: 'Hi! Can you tell me about your services?',
      timestamp: '10:01 AM'
    },
    { 
      type: 'bot', 
      text: 'Of course! I can assist you with various questions based on my knowledge base. What specific information are you looking for?',
      timestamp: '10:01 AM'
    },
    { 
      type: 'user', 
      text: 'What is your pricing?',
      timestamp: '10:02 AM'
    },
    { 
      type: 'bot', 
      text: data.fallbackMessage || 'I apologize, but I could not find an answer to your question.',
      timestamp: '10:02 AM'
    },
    // { 
    //   type: 'user', 
    //   text: 'Thanks anyway!',
    //   timestamp: '10:03 AM'
    // },
    // { 
    //   type: 'bot', 
    //   text: 'You\'re welcome! Feel free to ask me anything else.',
    //   timestamp: '10:03 AM'
    // },
  ];

  const [messages, setMessages] = useState<Message[]>(getDemoMessages());
  const [input, setInput] = useState('');

  // Update messages when welcome or fallback message changes
  useEffect(() => {
    setMessages(getDemoMessages());
  }, [data.welcomeMessage, data.fallbackMessage]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Add user message
    const newMessages = [...messages, { type: 'user' as const, text: input, timestamp: newTime }];
    setMessages(newMessages);

    // Simulate bot response with typing delay
    setTimeout(() => {
      const responses = [
        'This is a preview of your chatbot response.',
        'I can help you with that based on your configuration.',
        'Your knowledge base would be used to generate responses.',
        'Great question! Let me find that information for you.',
        `Based on my ${data.tone || 'friendly'} tone, I'm here to assist you.`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { type: 'bot', text: randomResponse, timestamp: newTime }]);
    }, 600);

    setInput('');
  };

  return (
    <div className="sticky top-8 bg-card rounded-xl border border-border shadow-lg overflow-hidden h-fit">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-primary-foreground">{data.name || 'Your Chatbot'}</h3>
            <p className="text-xs text-primary-foreground/80">Live Preview • Online</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[450px] overflow-y-auto p-4 space-y-3 bg-muted/20">
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
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span className={`text-xs text-muted-foreground px-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-3 bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Try typing a message..."
            className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This is a preview - actual responses will use your knowledge base
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="border-t border-border p-4 space-y-2 text-xs bg-muted/30">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Model:</span>
          <span className="font-medium text-foreground">{data.model || 'Not set'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Language:</span>
          <span className="font-medium text-foreground">{data.language?.toUpperCase() || 'EN'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tone:</span>
          <span className="font-medium text-foreground">{data.tone || 'Friendly'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Temperature:</span>
          <span className="font-medium text-foreground">{data.temperature?.toFixed(1) || '0.7'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-medium ${data.isPublic ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            {data.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
    </div>
  );
}
