import { cva } from "@compo/utils"
import { disabledVariants, focusVariants } from "./state"

/**
 * button variants for Schifflange website
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-colors",
    "whitespace-nowrap font-bold",
    focusVariants(),
    disabledVariants(),
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 uppercase",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground uppercase",
      },
      size: {
        lg: "h-[var(--input-lg-height)] rounded-sm text-base [&_svg]:size-4 [&_.icon]:size-4",
        default: "h-[var(--input-default-height)] rounded-sm text-sm [&_svg]:size-4 [&_.icon]:size-4",
        sm: "h-[var(--input-sm-height)] rounded-sm text-xs [&_svg]:size-4 [&_.icon]:size-4",
        xs: "h-[var(--input-xs-height)] rounded-sm text-xs [&_svg]:size-4 [&_.icon]:size-4",
        xxs: "h-[var(--input-xxs-height)] rounded-sm text-xs [&_svg]:size-3 [&_.icon]:size-3",
        leading: "",
      },
      icon: {
        false: "",
        true: "shrink-0",
      },
    },
    compoundVariants: [
      // without icon
      { icon: false, size: "default", class: "px-[var(--input-default-padding)] py-2 gap-2" },
      { icon: false, size: "lg", class: "px-[var(--input-lg-padding)] py-2 gap-3" },
      { icon: false, size: "sm", class: "px-[var(--input-sm-padding)] py-2 gap-2" },
      { icon: false, size: "xs", class: "px-[var(--input-xs-padding)] gap-2" },
      { icon: false, size: "xxs", class: "px-[var(--input-xxs-padding)] gap-2" },
      { icon: false, size: "leading", class: "gap-2" },
      // with icon (square)
      { icon: true, size: "default", class: "w-[var(--input-default-height)]" },
      { icon: true, size: "lg", class: "w-[var(--input-lg-height)]" },
      { icon: true, size: "sm", class: "w-[var(--input-sm-height)]" },
      { icon: true, size: "xs", class: "w-[var(--input-xs-height)]" },
      { icon: true, size: "xxs", class: "w-[var(--input-xxs-height)]" },
      { icon: true, size: "leading", class: "" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      icon: false,
    },
  }
)
