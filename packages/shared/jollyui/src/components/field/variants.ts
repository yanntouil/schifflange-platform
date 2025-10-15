import { cva } from "class-variance-authority"

export const labelVariants = cva([
  "text-sm font-medium leading-none",
  /* Disabled */
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
  /* Invalid */
  "group-data-[invalid]:text-destructive",
])

export const fieldGroupVariants = cva([], {
  variants: {
    variant: {
      default: [
        "relative flex w-full items-center rounded-md border border-input bg-background ring-offset-background",
        /* Focus Within */
        "data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2",
        /* Disabled */
        "data-[disabled]:opacity-50",
      ],
      ghost: "",
    },
    size: {
      default: "h-[var(--input-default-height)] py-2 text-sm",
      lg: "h-[var(--input-lg-height)] py-1 text-sm",
      sm: "h-[var(--input-sm-height)] py-1 text-xs",
      xs: "h-[var(--input-xs-height)] py-1 text-sm",
      xxs: "h-[var(--input-xxs-height)] py-1 text-sm",
    },
    icon: {
      default: "",
      left: "",
      right: "",
      both: "",
    },
  },
  compoundVariants: [
    { size: "default", icon: "default", class: "px-[var(--input-default-padding)]" },
    {
      size: "default",
      icon: "left",
      class: "pl-[calc(var(--input-default-height))] pr-[var(--input-default-padding)]",
    },
    {
      size: "default",
      icon: "right",
      class: "pl-[var(--input-default-padding)] pr-[calc(var(--input-default-padding)+var(--input-default-height))]",
    },
    { size: "default", icon: "both", class: "px-[calc(var(--input-default-height))]" },
    { size: "lg", icon: "default", class: "px-[var(--input-lg-padding)]" },
    {
      size: "lg",
      icon: "left",
      class: "pl-[calc(var(--input-lg-height))] pr-[var(--input-lg-padding)]",
    },
    {
      size: "lg",
      icon: "right",
      class: "pl-[var(--input-lg-padding)] pr-[calc(var(--input-lg-padding)+var(--input-lg-height))]",
    },
    { size: "lg", icon: "both", class: "px-[calc(var(--input-lg-height))]" },
    { size: "sm", icon: "default", class: "px-[var(--input-sm-padding)]" },
    {
      size: "sm",
      icon: "left",
      class: "pl-[calc(var(--input-sm-height))] pr-[var(--input-sm-padding)]",
    },
    {
      size: "sm",
      icon: "right",
      class: "pl-[var(--input-sm-padding)] pr-[calc(var(--input-sm-padding)+var(--input-sm-height))]",
    },
    { size: "sm", icon: "both", class: "px-[calc(var(--input-sm-height))]" },
    { size: "xs", icon: "default", class: "px-[var(--input-xs-padding)]" },
    {
      size: "xs",
      icon: "left",
      class: "pl-[calc(var(--input-xs-padding)+var(--input-xs-height))] pr-[var(--input-xs-padding)]",
    },
    {
      size: "xs",
      icon: "right",
      class: "pl-[var(--input-xs-padding)] pr-[calc(var(--input-xs-height))]",
    },
    { size: "xs", icon: "both", class: "px-[calc(var(--input-xs-height))]" },
    { size: "xxs", icon: "default", class: "px-[var(--input-xxs-padding)]" },
    {
      size: "xxs",
      icon: "left",
      class: "pl-[calc(var(--input-xxs-height))] pr-[var(--input-xxs-padding)]",
    },
    {
      size: "xxs",
      icon: "right",
      class: "pl-[var(--input-xxs-padding)] pr-[calc(var(--input-xxs-padding)+var(--input-xxs-height))]",
    },
    { size: "xxs", icon: "both", class: "px-[calc(var(--input-xxs-height))]" },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    icon: "default",
  },
})