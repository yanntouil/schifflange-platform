import { cva } from "@compo/utils"
import { disabledVariants } from "./disabled"
import { focusVariants } from "./focus"

/**
 * linkVariants
 */
export const linkVariants = cva([disabledVariants(), focusVariants()], {
  variants: {
    variant: {
      default:
        "rounded text-primary underline decoration-transparent underline-offset-4 transition-colors duration-300 ease-in-out hover:decoration-primary",
      underline:
        "rounded text-primary underline hover:text-primary/80 transition-colors underline-offset-4 transition-colors duration-300 ease-in-out",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export { linkVariants as link }
