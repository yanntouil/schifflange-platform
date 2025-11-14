import { cva } from "@compo/utils"
import { disabledVariants, focusVariants } from "./state"

export const linkVariants = cva(
  [
    "transition-colors duration-300 ease-in-out inline-block rounded-xs",
    disabledVariants(),
    focusVariants({ variant: "visible" }),
  ],
  {
    variants: {
      variant: {
        default: "underline decoration-transparent underline-offset-4",
        underline: "underline underline-offset-4",
      },
      color: {
        default:
          "text-primary hover:text-primary/80 hover:decoration-primary focus-visible:text-primary/80 focus-visible:decoration-primary",
        secondary:
          "text-secondary hover:text-secondary/80 hover:decoration-secondary focus-visible:text-secondary/80 focus-visible:decoration-secondary",
        foreground:
          "text-foreground hover:text-foreground/80 hover:decoration-foreground focus-visible:text-foreground/80 focus-visible:decoration-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
)
