'use client';

import { useState } from 'react';
import { Copy, Check, Code, Globe, Palette } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface EmbedCodeGeneratorProps {
  chatbotId: string;
  chatbotName: string;
}

export default function EmbedCodeGenerator({ chatbotId, chatbotName }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState('bottom-right');
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');
  const [buttonSize, setButtonSize] = useState('60');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Generate embed code
  const generateEmbedCode = () => {
    return `<!-- Ragly Chatbot Widget -->
<script>
  window.RAGLY_CHATBOT_ID = '${chatbotId}';
  window.RAGLY_POSITION = '${position}';
  window.RAGLY_PRIMARY_COLOR = '${primaryColor}';
  window.RAGLY_BUTTON_SIZE = '${buttonSize}px';
</script>
<script src="${baseUrl}/widget/chatbot-widget.js"></script>`;
  };

  // Generate React code
  const generateReactCode = () => {
    return `// Add to your React component
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Set configuration
    window.RAGLY_CHATBOT_ID = '${chatbotId}';
    window.RAGLY_POSITION = '${position}';
    window.RAGLY_PRIMARY_COLOR = '${primaryColor}';
    window.RAGLY_BUTTON_SIZE = '${buttonSize}px';

    // Load widget script
    const script = document.createElement('script');
    script.src = '${baseUrl}/widget/chatbot-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const widget = document.getElementById('ragly-widget');
      if (widget) widget.remove();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Your app content */}
    </div>
  );
}`;
  };

  // Generate WordPress code
  const generateWordPressCode = () => {
    return `<!-- Add to your WordPress theme footer.php or use a plugin like "Insert Headers and Footers" -->
<script>
  window.RAGLY_CHATBOT_ID = '${chatbotId}';
  window.RAGLY_POSITION = '${position}';
  window.RAGLY_PRIMARY_COLOR = '${primaryColor}';
  window.RAGLY_BUTTON_SIZE = '${buttonSize}px';
</script>
<script src="${baseUrl}/widget/chatbot-widget.js"></script>`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const presetColors = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code size={20} />
          Embed Code Generator
        </CardTitle>
        <CardDescription>
          Embed your chatbot widget on any website. Customize the appearance and copy the code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customization Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Customize Widget</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe size={14} />
                Position
              </Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Button Size */}
            <div className="space-y-2">
              <Label>Button Size (px)</Label>
              <Input
                type="number"
                min="40"
                max="80"
                value={buttonSize}
                onChange={(e) => setButtonSize(e.target.value)}
              />
            </div>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette size={14} />
              Primary Color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1"
                placeholder="#4F46E5"
              />
            </div>
            
            {/* Color Presets */}
            <div className="flex gap-2 flex-wrap">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setPrimaryColor(color.value)}
                  className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-border overflow-hidden">
            <div
              className="absolute"
              style={{
                [position.includes('right') ? 'right' : 'left']: '16px',
                bottom: '16px',
              }}
            >
              <div
                className="rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                style={{
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%)`,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code Tabs */}
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-2">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{generateEmbedCode()}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateEmbedCode(), 'HTML code')}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add this code to your website's HTML, preferably before the closing {'</body>'} tag.
            </p>
          </TabsContent>

          <TabsContent value="react" className="space-y-2">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{generateReactCode()}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateReactCode(), 'React code')}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this code in your React component. The widget will load when the component mounts.
            </p>
          </TabsContent>

          <TabsContent value="wordpress" className="space-y-2">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{generateWordPressCode()}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateWordPressCode(), 'WordPress code')}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add this code to your WordPress theme's footer.php or use a plugin like "Insert Headers and Footers".
            </p>
          </TabsContent>
        </Tabs>

        {/* Quick Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
            📌 Quick Setup Guide
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Customize the widget appearance above</li>
            <li>2. Copy the code for your platform (HTML/React/WordPress)</li>
            <li>3. Paste the code into your website</li>
            <li>4. The chatbot widget will appear automatically! 🎉</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const clamp = (val: number) => Math.min(Math.max(val, 0), 255);
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00FF) + amount);
  const b = clamp((num & 0x0000FF) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
