import { formatDate, formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface EntryCardProps {
  date: string;
  content: string;
  promptText?: string | null;
  compact?: boolean;
  className?: string;
}

export function EntryCard({
  date,
  content,
  promptText,
  compact = false,
  className,
}: EntryCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-card/50 p-4",
        "transition-colors hover:bg-card/80",
        className
      )}
    >
      <div className="flex items-baseline justify-between mb-2">
        <time className="text-sm font-sans text-muted-foreground">
          {compact ? formatDateShort(date) : formatDate(date)}
        </time>
      </div>
      {promptText && (
        <p className="text-xs text-muted-foreground/60 italic mb-1.5 font-sans">
          {promptText}
        </p>
      )}
      <p className={cn(
        "font-serif leading-relaxed text-foreground/90",
        compact ? "text-sm" : "text-base"
      )}>
        {content}
      </p>
    </div>
  );
}
