import { cva } from "@compo/utils"

/**
 * quoteVariants
 */
export const quoteVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-xs [&>h5]:text-sm/none [&>svg+div]:translate-y-[-3px] [&>svg]:size-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-card",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
