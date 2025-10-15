import { variants } from "@compo/ui"
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    /* Disabled */
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
    /* Focus Visible */
    "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-background",
    variants.disabled(),
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow data-[hovered]:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm data-[hovered]:bg-destructive/90",
        outline: "border border-input bg-transparent data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm data-[hovered]:bg-secondary/80",
        ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground data-[hovered]:disabled:bg-transparent data-[hovered]:disabled:text-inherit transition-colors duration-300 ease-in-out",
        link: "text-primary underline-offset-4 data-[hovered]:underline",
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
      { icon: false, size: "default", class: "px-[var(--input-default-padding)] py-2 gap-2" },
      { icon: false, size: "lg", class: "px-[var(--input-lg-padding)] py-2 gap-3" },
      { icon: false, size: "sm", class: "px-[var(--input-sm-padding)] py-2 gap-2" },
      { icon: false, size: "xs", class: "px-[var(--input-xs-padding)] gap-2" },
      { icon: false, size: "xxs", class: "px-[var(--input-xxs-padding)] gap-2" },
      { icon: false, size: "leading", class: "gap-2" },
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