'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface PreviewPanelProps {
  data: any;
}

export default function PreviewPanel({ data }: PreviewPanelProps) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: data.welcomeMessage || 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { type: 'user', text: input }]);

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        'This is a preview of your chatbot response.',
        'I can help you with that based on your configuration.',
        'Your knowledge base would be used to generate responses.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { type: 'bot', text: randomResponse }]);
    }, 600);

    setInput('');
  };

  return (
    <div className="sticky top-8 bg-card rounded-xl border border-border shadow-lg overflow-hidden h-fit">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <h3 className="font-bold text-primary-foreground">{data.name || 'Your Chatbot'}</h3>
        <p className="text-xs text-primary-foreground/80">Live Preview</p>
      </div>

      {/* Chat Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/20 flex flex-col justify-end">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-border'
              }`}
            >
              {msg.text}
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
            placeholder="Try a message..."
            className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
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
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-medium ${data.isPublic ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            {data.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
    </div>
  );
}
