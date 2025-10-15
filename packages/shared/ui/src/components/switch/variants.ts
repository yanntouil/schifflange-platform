import { cva } from "@compo/utils"
import { disabledVariants, focusVisibleVariants } from "../../variants"

export const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
    "data-[state=unchecked]:bg-input shadow-sm",
    "transition-colors duration-300",
    focusVisibleVariants(),
    disabledVariants(),
  ],
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary",
      },
      size: {
        default: "h-5 w-9",
        sm: "h-4 w-7",
        lg: "h-6 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
export const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full ring-0 data-[state=unchecked]:translate-x-0",
    "transition-transform duration-300",
    "bg-background shadow-lg",
  ],
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "size-4 data-[state=checked]:translate-x-4",
        sm: "size-3 data-[state=checked]:translate-x-3",
        lg: "size-5 data-[state=checked]:translate-x-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
