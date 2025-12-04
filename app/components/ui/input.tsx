import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full bg-background dark:bg-[#18181b] border border-border dark:border-[#27272a] rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
