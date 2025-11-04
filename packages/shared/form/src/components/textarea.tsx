import { variants } from "@compo/ui"
import { cxm, G, VariantProps } from "@compo/utils"
import React from "react"
import {
  extractGroupProps,
  extractInputProps,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "."

/**
 * FormTextarea
 */
export type FormTextareaProps = FieldTextareaProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ classNames, ...props }, ref) => {
    return (
      <FormGroup {...extractGroupProps(props)} classNames={classNames}>
        <FieldTextarea {...extractInputProps({ ...props })} ref={ref} className={classNames?.input} />
      </FormGroup>
    )
  }
)
FormTextarea.displayName = "FormTextarea"

/**
 * FieldTextarea
 */
type FieldTextareaProps = React.ComponentProps<"textarea"> & VariantProps<typeof variants.input>
const FieldTextarea = React.forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
  ({ className, placeholder, disabled, rows = 3, icon, size, onChange, ...props }, ref) => {
    const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string>()

    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const onMouseEnter = (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
      setIsHovered(true)
      props.onMouseEnter?.(e)
    }
    const onMouseLeave = (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
      setIsHovered(false)
      props.onMouseLeave?.(e)
    }
    const onFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }
    const onBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }
    const counterValues = React.useMemo(() => {
      if (!G.isNumber(props.maxLength)) return null
      return {
        length: value.length,
        max: props.maxLength,
        rest: props.maxLength - value.length,
        isFull: value.length === props.maxLength,
      }
    }, [props.maxLength, value])

    const field = (
      <textarea
        onChange={(e) => {
          setFieldValue(e.target.value)
          if (onChange) onChange(e)
        }}
        {...props}
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cxm(
          variants.input({ icon, size }),
          variants.scrollbar({ hover: isHovered, focus: isFocused }),
          "h-auto w-full resize-none py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent",
          className
        )}
        value={value}
        disabled={ctxDisabled || disabled}
      />
    )
    if (counterValues)
      return (
        <div className='relative w-full'>
          {field}
          <span
            className={cxm(
              "absolute bottom-2 right-2 text-[10px] leading-none",
              counterValues.isFull ? "text-destructive" : "text-muted-foreground/50"
            )}
            aria-hidden
          >
            {counterValues?.length}/{counterValues?.max}
          </span>
        </div>
      )
    return field
  }
)

/**
 * InputTextarea
 */
type InputTextareaProps = Omit<React.ComponentProps<"textarea">, "value" | "onChange"> &
  VariantProps<typeof variants.input> & {
    value: string
    onValueChange: (value: string) => void
  }
export const InputTextarea = React.forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  ({ className, placeholder, disabled, rows = 3, icon, size, value, onValueChange, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const onMouseEnter = (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
      setIsHovered(true)
      props.onMouseEnter?.(e)
    }
    const onMouseLeave = (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
      setIsHovered(false)
      props.onMouseLeave?.(e)
    }
    const onFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }
    const onBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }
    const counterValues = React.useMemo(() => {
      if (!G.isNumber(props.maxLength)) return null
      return {
        length: value.length,
        max: props.maxLength,
        rest: props.maxLength - value.length,
        isFull: value.length === props.maxLength,
      }
    }, [props.maxLength, value])

    const field = (
      <textarea
        onChange={(e) => onValueChange(e.target.value)}
        {...props}
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cxm(
          variants.input({ icon, size }),
          variants.scrollbar({ hover: isHovered, focus: isFocused }),
          "h-auto w-full resize-none py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent",
          className
        )}
        value={value}
        disabled={disabled}
      />
    )
    if (counterValues)
      return (
        <div className='relative w-full'>
          {field}
          <span
            className={cxm(
              "absolute bottom-2 right-2 text-[10px] leading-none",
              counterValues.isFull ? "text-destructive" : "text-muted-foreground/50"
            )}
            aria-hidden
          >
            {counterValues?.length}/{counterValues?.max}
          </span>
        </div>
      )
    return field
  }
)
