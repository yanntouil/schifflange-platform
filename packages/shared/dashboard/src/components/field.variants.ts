import { cva } from "class-variance-authority"

/**
 * fieldRootVariants
 */
export const fieldRootVariants = cva("group/fields flex flex-col @container/fields", {
  variants: {
    variant: {
      default: "",
    },
    divider: {
      false: "",
      true: "divide-input divide-y",
    },
    stretch: {
      false: "",
      true: "",
    },
    size: {
      default: "text-sm",
      lg: "text-base",
      sm: "text-xs",
      xs: "text-xs",
      xxs: "text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    divider: false,
    stretch: false,
  },
})

/**
 * fieldItemVariants
 */
export const fieldItemVariants = cva("flex grid-cols-[1fr_2fr] flex-col items-start gap-x-2 gap-y-1 text-sm @lg/fields:grid", {
  variants: {
    variant: {
      default: "",
    },
    divider: {
      false: "",
      true: "",
    },
    stretch: {
      false: "py-4",
      true: "py-2",
    },
    size: {
      default: "",
      lg: "",
      sm: "",
      xs: "",
      xxs: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    divider: false,
    stretch: false,
  },
})
