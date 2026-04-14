'use client';

import { Label } from '@/components/ui/label';
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
  const tones = ['Friendly', 'Professional', 'Direct', 'Formal', 'Casual'];

  return (
    <div className="space-y-8">
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
            className="w-full min-h-20 p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal text-sm"
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
            className="w-full min-h-20 p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal text-sm"
          />
        </div>
      </div>

      {/* Tone & Temperature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="tone" className="text-base font-semibold mb-2">
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
          <Label htmlFor="temperature" className="text-base font-semibold mb-2 flex justify-between">
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
