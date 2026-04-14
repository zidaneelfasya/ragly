export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-1 w-48 overflow-hidden rounded-full bg-secondary/20">
          <div className="absolute inset-y-0 left-0 w-full animate-progress bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase mt-2 animate-pulse">
          Memuat
        </p>
      </div>
    </div>
  );
}
