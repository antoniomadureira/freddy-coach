import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", children, ...props }: any) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        variant === "outline" && "border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}