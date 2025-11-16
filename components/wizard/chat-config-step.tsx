'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChatConfigStepProps {
  data: any;
  setData: (data: any) => void;
}

export default function ChatConfigStep({ data, setData }: ChatConfigStepProps) {
  const [commands, setCommands] = useState([
    { command: '/help', description: 'Get help with common questions' },
  ]);

  const tones = ['Friendly', 'Professional', 'Direct', 'Formal', 'Casual'];

  const addCommand = () => {
    setCommands([...commands, { command: '', description: '' }]);
  };

  const removeCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  const updateCommand = (index: number, field: string, value: string) => {
    const updated = [...commands];
    updated[index] = { ...updated[index], [field]: value };
    setCommands(updated);
    setData({ ...data, commands: updated });
  };

  return (
    <div className="space-y-8">
      {/* Command Builder */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold">Custom Commands</Label>
          <Button
            type="button"
            onClick={addCommand}
            variant="outline"
            size="sm"
            className="gap-2 border-primary text-primary hover:bg-primary/5"
          >
            <Plus size={16} /> Add Command
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-foreground">/Command</th>
                <th className="text-left p-3 font-semibold text-foreground">Description</th>
                <th className="text-center p-3 font-semibold text-foreground w-12">Action</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <Input
                      placeholder="/command"
                      value={cmd.command}
                      onChange={(e) => updateCommand(index, 'command', e.target.value)}
                      className="h-9 bg-input border-border text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      placeholder="Command description"
                      value={cmd.description}
                      onChange={(e) => updateCommand(index, 'description', e.target.value)}
                      className="h-9 bg-input border-border text-sm"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeCommand(index)}
                      className="text-destructive hover:text-destructive/80 transition-colors inline-flex"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Messages */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Custom Responses</h3>

        <div>
          <Label htmlFor="welcome" className="text-sm font-medium mb-2 block">
            Welcome Message
          </Label>
          <textarea
            id="welcome"
            value={data.welcomeMessage}
            onChange={(e) => setData({ ...data, welcomeMessage: e.target.value })}
            className="w-full min-h-20 p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-sm"
          />
        </div>

        <div>
          <Label htmlFor="fallback" className="text-sm font-medium mb-2 block">
            Fallback Message (when no answer found)
          </Label>
          <textarea
            id="fallback"
            value={data.fallbackMessage}
            onChange={(e) => setData({ ...data, fallbackMessage: e.target.value })}
            className="w-full min-h-20 p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-sm"
          />
        </div>
      </div>

      {/* Tone & Temperature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="tone" className="text-base font-semibold mb-2 block">
            Tone & Style
          </Label>
          <Select value={data.tone} onValueChange={(value) => setData({ ...data, tone: value })}>
            <SelectTrigger id="tone" className="bg-input border-border h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="temperature" className="text-base font-semibold mb-2 block flex justify-between">
            <span>Temperature</span>
            <span className="text-primary font-bold">{data.temperature.toFixed(1)}</span>
          </Label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.temperature}
            onChange={(e) => setData({ ...data, temperature: parseFloat(e.target.value) })}
            className="w-full h-2 bg-muted rounded-lg cursor-pointer accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">Lower = more consistent, Higher = more creative</p>
        </div>
      </div>
    </div>
  );
}
