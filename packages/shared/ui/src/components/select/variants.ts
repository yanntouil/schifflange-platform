import { cva, cx } from "@compo/utils"
import { disabledVariants, focusVisibleVariants, inputBackground, inputBorder, inputRounded } from "../../variants"

/**
 * selectVariants
 */
export const selectVariants = cva(
  [
    "flex w-full items-center justify-between whitespace-nowrap",
    "placeholder:text-muted-foreground [&>span]:line-clamp-1",
    inputRounded(),
    focusVisibleVariants(),
    disabledVariants(),
  ],
  {
    variants: {
      variant: {
        default: cx(inputBorder(), inputBackground()),
        ghost: "border border-transparent bg-transparent",
      },
      size: {
        default: "h-9 px-3 py-2 text-sm",
        lg: "h-10 px-3 py-2 text-sm",
        sm: "h-8 px-3 py-2 text-sm",
        xs: "h-7 px-3 py-2 text-xs",
        xxs: "h-6 px-1.5 py-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
