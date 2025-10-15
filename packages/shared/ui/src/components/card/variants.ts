import { cva } from "class-variance-authority"

export const cardShadowVariants = cva("")
export const cardVariants = cva(["", cardShadowVariants()], {
  variants: {
    variant: {
      default: "rounded border-border border bg-card text-card-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export const cardHeaderVariants = cva("", {
  variants: {
    variant: {
      default: "flex flex-col space-y-1.5 p-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export const cardTitleVariants = cva("", {
  variants: {
    variant: {
      default: "font-semibold leading-none tracking-tight",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export const cardDescriptionVariants = cva("", {
  variants: {
    variant: {
      default: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export const cardContentVariants = cva("", {
  variants: {
    variant: {
      default: "p-6 pt-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export const cardFooterVariants = cva("", {
  variants: {
    variant: {
      default: "flex items-center p-6 pt-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
