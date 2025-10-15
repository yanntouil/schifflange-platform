import { cva } from "@compo/utils"

export const scrollbarVariants = cva("", {
  variants: {
    variant: {
      default:
        "scrollbar scrollbar-w-1 scrollbar-thumb-gray-500/30 scrollbar-track-transparent scrollbar-thumb-rounded-full",
      thin: "scrollbar-thin scrollbar-thumb-gray-500/30 scrollbar-track-transparent scrollbar-thumb-rounded-full",
      transparent: "scrollbar scrollbar-w-1 scrollbar-track-transparent",
    },
    hover: {
      false: "scrollbar-thumb-transparent",
      true: "scrollbar-thumb-gray-600/40",
      undefined: "",
    },
    focus: {
      false: "scrollbar-thumb-transparent",
      true: "scrollbar-thumb-gray-600/40",
      undefined: "",
    },
  },
  defaultVariants: {
    variant: "default",
    hover: undefined,
    focus: undefined,
  },
})
export { scrollbarVariants as scrollbar }
