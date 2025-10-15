import { cva } from "class-variance-authority"
import { disabledVariants, focusVisibleVariants, inputRounded } from "../../variants"

/**
 * checkboxVariants
 */
export const checkboxVariants = cva(
  ["peer shrink-0 border", focusVisibleVariants(), disabledVariants(), inputRounded()],
  {
    variants: {
      variant: {
        default: "border-primary shadow data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        destructive:
          "border-destructive shadow data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
        outline: "border-primary data-[state=checked]:bg-transparent data-[state=checked]:text-primary",
      },
      size: {
        default: "size-5 [&_svg]:size-4",
        lg: "size-8 [&_svg]:size-4",
        sm: "size-4 [&_svg]:size-3",
        xs: "",
        xxs: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
