import React from "react"
import { cva, cxm, S, VariantProps } from "@compo/utils"

/**
 * Skeleton
 */
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants> & {
    rows?: number
  }
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, rows = 1, children, ...props }, ref) => {
    const isText = S.startsWith(variant ?? "", "text")
    const isButton = S.startsWith(variant ?? "", "button")
    return (
      <div ref={ref} aria-hidden className={cxm("animate-pulse", skeletonVariants({ variant }), className)} {...props}>
        {isText &&
          Array.from({ length: rows }).map((_, index) => (
            <div key={index}>
              <div />
            </div>
          ))}
      </div>
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }

const skeletonVariants = cva("", {
  variants: {
    variant: {
      //font-size: 1.25rem | line-height: 1.75rem
      "text-xl":
        "flex flex-col w-full [&>div]:h-[1.75rem] [&>div]:flex [&>div]:items-center [&>div>div]:h-[1.25rem] [&>div>div]:rounded-md [&>div>div]:bg-primary/10 [&>div>div]:max-w-sm [&>div>div]:w-full",
      //font-size: 1rem | line-height: 1.5rem
      "text-lg":
        "flex flex-col w-full [&>div]:h-[1.125rem] [&>div]:flex [&>div]:items-center [&>div>div]:h-[1rem] [&>div>div]:rounded-md [&>div>div]:bg-primary/10 [&>div>div]:max-w-sm [&>div>div]:w-full",
      "text-base":
        "flex flex-col w-full [&>div]:h-[1.5rem] [&>div]:flex [&>div]:items-center [&>div>div]:h-[1rem] [&>div>div]:rounded-md [&>div>div]:bg-primary/10 [&>div>div]:max-w-sm [&>div>div]:w-full",
      "text-sm":
        "flex flex-col w-full [&>div]:h-[1.25rem] [&>div]:flex [&>div]:items-center [&>div>div]:h-[0.75rem] [&>div>div]:rounded-md [&>div>div]:bg-primary/10 [&>div>div]:max-w-sm [&>div>div]:w-full",
      "text-xs":
        "flex flex-col w-full [&>div]:h-[0.75rem] [&>div]:flex [&>div]:items-center [&>div>div]:h-[0.5rem] [&>div>div]:rounded-md [&>div>div]:bg-primary/10 [&>div>div]:max-w-sm [&>div>div]:w-full",
      image: "shrink-0 rounded-md bg-primary/10",
      button: "shrink-0 rounded-md bg-primary/10 size-9",
      "button-icon": "shrink-0 rounded-md bg-primary/10 size-9",
      "button-icon-sm": "shrink-0 rounded-md bg-primary/10 size-8",
      checkbox: "shrink-0 rounded-sm bg-primary/10 size-[17px] border border-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "text-base",
  },
})
