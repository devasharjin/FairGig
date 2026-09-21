import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 select-none [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-transparent shadow-xs hover:bg-primary/90",
        secondary:
          "bg-muted text-muted-foreground border-border/80 hover:bg-muted/80 hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/25 hover:bg-destructive/15",
        success:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/15",
        warning:
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 hover:bg-amber-500/15",
        accent:
          "bg-accent/10 text-accent border-accent/25 hover:bg-accent/15",
        outline:
          "border-border/80 bg-card/80 text-foreground shadow-2xs hover:bg-muted hover:text-foreground",
        ghost:
          "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        solidDestructive:
          "bg-destructive text-destructive-foreground border-transparent shadow-xs hover:bg-destructive/90",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  })
}

export { Badge, badgeVariants }
