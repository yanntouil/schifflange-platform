import { variants } from "@compo/ui"
import { cva, cx } from "@compo/utils"

/**
 * gapVariants
 */
export const gapVariants = cva("", {
  variants: {
    size: {
      default: "gap-x-4 gap-y-2",
      lg: "gap-x-3 gap-y-2 @2xl/toolbar:gap-x-6 @2xl/toolbar:gap-y-3",
      sm: "gap-x-3 gap-y-2",
      xs: "gap-x-2 gap-y-1",
      xxs: "gap-x-2 gap-y-1",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

/**
 * viewVariants
 */
export const viewVariants = cva(["gap-1", variants.inputRounded()], {
  variants: {
    size: {
      default: "h-[var(--input-default-height)]",
      lg: "h-[var(--input-lg-height)]",
      sm: "h-[var(--input-sm-height)]",
      xs: "h-[var(--input-xs-height)]",
      xxs: "h-[var(--input-xxs-height)]",
    },
    defaultVariants: {
      size: "default",
    },
  },
})

/**
 * viewItemVariants
 */
export const viewItemVariants = cva(
  cx(
    "inline-flex items-center justify-center relative",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-colors",
    "aspect-square h-full",
    "hover:bg-secondary/80",
    "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary data-[selected=true]:hover:text-primary-foreground",
    variants.focusVisible(),
    variants.disabled()
  ),
  {
    variants: {
      size: {
        default: "[&>svg]:size-4",
        lg: "[&>svg]:size-4",
        sm: "[&>svg]:size-3",
        xs: "[&>svg]:size-3",
        xxs: "[&>svg]:size-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)
