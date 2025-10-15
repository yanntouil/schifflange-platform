import { cva, cx, cxm } from "@compo/utils"
import { disabledVariants, focusVisibleVariants } from "."

/**
 * fieldErrorVariants
 */
export const fieldErrorVariants = cva("text-xs font-medium text-destructive")

/**
 * labelVariants
 */
export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * fieldWrapperVariants
 */
export const fieldWrapperVariants = cva("space-y-2")

/**
 * inputRounded
 * default rounded use in most input
 */
export const inputRounded = cva("rounded-sm")

/**
 * inputBorder
 * default border use in most input
 */
export const inputBorder = cva("border", {
  variants: {
    variant: {
      default: "border-input",
      dashed: "border-dashed border-input",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * inputBackground
 * default background use in most input
 */
export const inputBackground = cva("bg-card", {
  variants: {
    variant: {
      default: "bg-card",
    },
    active: {
      false: "bg-card",
      true: "bg-primary/10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * inputShadow
 * default shadow use in most input
 */
export const inputShadow = cva("")

/**
 * inputVariants
 */
export const inputVariants = cva(
  [
    "flex w-full transition-colors",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground",
    focusVisibleVariants(),
    inputRounded(),
    disabledVariants(),
    inputBorder(),
    inputBackground(),
    inputShadow(),
  ],
  {
    variants: {
      size: {
        default: "h-[var(--input-default-height)] py-1 text-sm",
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
      size: "default",
      icon: "default",
    },
  }
)
export const inputAutoWidthVariants = cva(["flex w-full opacity-0"], {
  variants: {
    size: {
      default: "h-[var(--input-default-height)] py-1 text-sm",
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
    size: "default",
    icon: "default",
  },
})

/**
 * inputIconVariants
 * use to display icon inside input
 */
export const inputIconVariants = cva(cx("absolute top-0 flex justify-center items-center shrink-0"), {
  variants: {
    size: {
      default: "size-[var(--input-default-height)] [&>svg]:size-4",
      lg: "size-[var(--input-lg-height)] [&>svg]:size-4",
      sm: "size-[var(--input-sm-height)] [&>svg]:size-4",
      xs: "size-[var(--input-xs-height)] [&>svg]:size-4",
      xxs: "size-[var(--input-xxs-height)] [&>svg]:size-4",
    },
    side: {
      left: "left-0",
      right: "right-0",
    },
  },
  defaultVariants: {
    size: "default",
    side: "left",
  },
})

/**
 * buttonField
 */
export const buttonField = cva(
  cx(
    "flex justify-center items-center w-full",
    "bg-muted/80 text-muted-foreground/80",
    focusVisibleVariants(),
    inputRounded(),
    disabledVariants(),
    inputBorder(),
    inputShadow()
  )
)

/**
 * alertVariants
 */
export const alertVariants = cva("flex items-start gap-2 rounded-md bg-primary/10 p-4 text-sm", {
  variants: {
    variant: {
      default: "bg-muted/80 text-muted-foreground [&>svg]:text-muted-foreground",
      info: cxm(
        "border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50",
        "[&>svg]:text-gray-600 dark:[&>svg]:text-gray-400 [&>svg]:stroke-[1.4]"
      ),
      success: "bg-success/10 text-muted-foreground [&>svg]:text-success",
      warning: cxm(
        "border border-amber-200 bg-amber-50 [&>svg]:text-amber-600 [&>svg]:stroke-[1.4] text-amber-800 dark:[&>svg]:text-amber-200 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400",
        "[&>svg]:text-amber-600 dark:[&>svg]:text-amber-200"
      ),
      destructive: "bg-destructive/10 text-muted-foreground [&>svg]:text-destructive",
    },
  },
})
export {
  alertVariants as alert,
  fieldErrorVariants as fieldError,
  fieldWrapperVariants as fieldWrapper,
  inputVariants as input,
  inputAutoWidthVariants as inputAutoWidth,
  inputIconVariants as inputIcon,
  labelVariants as label,
}
