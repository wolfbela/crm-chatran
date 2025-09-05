import * as React from "react"
import { cn } from "@/lib/utils"

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground",
          className
        )}
        {...props}
      >
        <p className="text-xs">{children}</p>
      </div>
    )
  }
)
Tag.displayName = "Tag"

export { Tag }
