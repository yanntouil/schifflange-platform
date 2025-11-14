import { cva } from "@compo/utils"

/**
 * Focus Variants
 */
export const focusVariants = cva([], {
  variants: {
    variant: {
      default: "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      visible:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      within:
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * Disabled Variants
 */
export const disabledVariants = cva("", {
  variants: {
    disabled: {
      default: "disabled:cursor-not-allowed disabled:opacity-50",
      false: "",
      true: "cursor-not-allowed opacity-50 hover:bg-inherit hover:text-inherit",
    },
  },
  defaultVariants: {
    disabled: "default",
  },
})
