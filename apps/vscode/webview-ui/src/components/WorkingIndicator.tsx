import { cn } from "@/lib/utils";

export function WorkingIndicator({ label, className }: { label: string; className?: string }) {
  return (
    <div role="status" className={cn("kimi-working-indicator", className)}>
      <span className="kimi-wi-face" aria-hidden="true">
        <span className="kimi-wi-eyes">
          <span className="kimi-wi-eye kimi-wi-eye--left" />
          <span className="kimi-wi-eye kimi-wi-eye--right" />
        </span>
      </span>
      <span className="kimi-wi-label">{label}</span>
    </div>
  );
}
