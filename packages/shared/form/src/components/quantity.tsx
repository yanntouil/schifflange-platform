import { Translation, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, VariantProps } from "@compo/utils"
import { Minus, Plus } from "lucide-react"
import React from "react"
import { extractGroupProps, extractInputProps, FormGroup, useFieldContext } from "."
import { FormNumberProps, InputNumber } from "./number"

/**
 * FormQuantity
 */
export const FormQuantity = React.forwardRef<HTMLInputElement, FormNumberProps>(({ classNames, ...props }, ref) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldQuantity {...extractInputProps({ ...props })} ref={ref} className={classNames?.input} />
    </FormGroup>
  )
})
FormQuantity.displayName = "FormQuantity"

/**
 * FieldQuantity
 */
const FieldQuantity = React.forwardRef<HTMLInputElement, FormNumberProps>(
  ({ disabled: fieldDisabled, max = Number.MAX_SAFE_INTEGER, min = 0, className, ...props }, ref) => {
    const {
      value = 0,
      setFieldValue: onValueChange,
      disabled: ctxDisabled,
      id,
      aria,
      dataset,
    } = useFieldContext<number>()
    const disabled = fieldDisabled || ctxDisabled

    const mergedProps = {
      ...props,
      min,
      max,
      disabled,
      id,
      value,
      onValueChange,
      ...aria,
      ...dataset,
    }
    return (
      <div className={cxm("relative w-full", className)}>
        <ButtonMinus {...{ value, onValueChange, disabled, min }} />
        <InputNumber
          {...mergedProps}
          ref={ref}
          decimalPrecision={0}
          unsigned
          className={variants.input({ icon: "both", className: cxm("text-center") })}
        />
        <ButtonPlus {...{ value, onValueChange, disabled, max }} />
      </div>
    )
  }
)
FieldQuantity.displayName = "FieldQuantity"

/**
 * InputQuantity
 */
export const InputQuantity = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof InputNumber>>(
  ({ className, ...props }, ref) => {
    const { value, onValueChange, disabled, size = "default", max = Number.MAX_SAFE_INTEGER, min = 0, step } = props
    return (
      <div className='relative w-full'>
        <ButtonMinus {...{ value, onValueChange, disabled, min, size, step }} />
        <InputNumber
          ref={ref}
          min={min}
          max={max}
          decimalPrecision={0}
          unsigned
          icon='both'
          size={size}
          className={cxm("text-center", className)}
          {...props}
        />
        <ButtonPlus {...{ value, onValueChange, disabled, max, size, step }} />
      </div>
    )
  }
)
InputQuantity.displayName = "InputQuantity"

/**
 * ButtonMinus
 */
type ButtonMinusProps = {
  disabled?: boolean
  min?: number
  step?: number
  value: number
  onValueChange: (value: number) => void
  size?: VariantProps<typeof variants.inputIcon>["size"]
}
const ButtonMinus: React.FC<ButtonMinusProps> = ({
  disabled = false,
  min = Number.MIN_SAFE_INTEGER,
  step = 1,
  value,
  onValueChange,
  size = "default",
}) => {
  const { _ } = useTranslation(dictionary)
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const currentStep = e.shiftKey ? step * 10 : step
    if (value - currentStep >= min) onValueChange(value - currentStep)
    else onValueChange(min)
  }
  return (
    <Ui.Button
      onClick={onClick}
      disabled={disabled}
      icon
      variant='ghost'
      size={size}
      tabIndex={-1}
      className={variants.inputIcon({ side: "left", size, className: "text-muted-foreground" })}
    >
      <Minus aria-hidden />
      <Ui.SrOnly>{_("minus")}</Ui.SrOnly>
    </Ui.Button>
  )
}

/**
 * ButtonPlus
 */
type ButtonPlusProps = {
  disabled?: boolean
  max?: number
  step?: number
  value: number
  onValueChange: (value: number) => void
  size?: VariantProps<typeof variants.inputIcon>["size"]
}
const ButtonPlus: React.FC<ButtonPlusProps> = ({
  disabled = false,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  value,
  onValueChange,
  size = "default",
}) => {
  const { _ } = useTranslation(dictionary)
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const currentStep = e.shiftKey ? step * 10 : step
    if (value + currentStep <= max) onValueChange(value + currentStep)
    else onValueChange(max)
  }
  return (
    <Ui.Button
      onClick={onClick}
      disabled={disabled}
      icon
      size={size}
      variant='ghost'
      tabIndex={-1}
      className={variants.inputIcon({ side: "right", size, className: "text-muted-foreground" })}
    >
      <Plus aria-hidden className='size-4' />
      <Ui.SrOnly>{_("plus")}</Ui.SrOnly>
    </Ui.Button>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    plus: "Plus",
    minus: "Minus",
  },
  fr: {
    plus: "Plus",
    minus: "Moins",
  },
  de: {
    plus: "Mehr",
    minus: "Weniger",
  },
} satisfies Translation
