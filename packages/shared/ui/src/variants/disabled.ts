import { cva } from "@compo/utils"

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
export { disabledVariants as disabled }
