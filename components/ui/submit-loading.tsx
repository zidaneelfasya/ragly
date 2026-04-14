import { cn } from "@/lib/utils"

interface SubmitLoadingProps {
  isLoading: boolean
  text?: string
}

export function SubmitLoading({ isLoading, text = "Memproses..." }: SubmitLoadingProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex items-center gap-3 rounded-full border bg-background/90 px-6 py-3 shadow-lg ring-1 ring-border/50 animate-in zoom-in-95 duration-300">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
        <p className="text-sm font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {text}
        </p>
      </div>
    </div>
  )
}
