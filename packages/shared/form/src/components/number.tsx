import { useRefStateWithDirty } from "@compo/hooks"
import { variants } from "@compo/ui"
import { F, N, Option, S, VariantProps, flow } from "@compo/utils"
import React from "react"
import { mergeRefs } from "react-merge-refs"
import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  isFiniteNumber,
  round,
  useFieldContext,
} from "."

/**
 * FormNumber
 */
export type FormNumberProps = FieldNumberProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormNumber = React.forwardRef<HTMLInputElement, FormNumberProps>(({ classNames, ...props }, ref) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldNumber {...extractInputProps({ ...props })} ref={ref} className={classNames?.input} />
    </FormGroup>
  )
})
FormNumber.displayName = "FormNumber"

/**
 * FieldtNumber
 */
type FieldNumberProps = Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
  min?: number
  max?: number
  step?: number
  modifierStep?: number
  decimalPrecision?: number
  blurOnEnter?: boolean
  respectFocus?: boolean
  unsigned?: boolean
  adjustValue?: (value: number) => number
  postfix?: string
  deferChanges?: boolean
  placeholder?: string
} & VariantProps<typeof variants.input>
const FieldNumber = React.forwardRef<HTMLInputElement, FieldNumberProps>(
  ({ disabled: fieldDisabled, className, ...props }, ref) => {
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
      disabled,
      id,
      className,
      value,
      onValueChange,
      ...aria,
      ...dataset,
    }
    return <InputNumber {...mergedProps} ref={ref} />
  }
)
FieldNumber.displayName = "FieldtNumber"

/**
 * InputNumber
 */
type InputNumberProps = Omit<React.ComponentPropsWithoutRef<"input">, "size" | "value" | "onChange"> &
  VariantProps<typeof variants.input> & {
    min?: number
    max?: number
    step?: number
    modifierStep?: number
    decimalPrecision?: number
    blurOnEnter?: boolean
    respectFocus?: boolean
    unsigned?: boolean
    adjustValue?: (value: number) => number
    postfix?: string
    deferChanges?: boolean
    placeholder?: string
    value: number
    onValueChange: (value: number) => void
  }
export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      postfix = "",
      step = 1,
      modifierStep = 10,
      decimalPrecision = 2,
      respectFocus = true,
      adjustValue = F.identity,
      unsigned = false,
      deferChanges = false,
      value,
      onValueChange,
      className,
      icon,
      size,
      ...props
    },
    ref
  ) => {
    // si min est set et unsigned est true, minValue doit abs
    const minValue = unsigned ? Math.abs(min ?? 0) : min

    const focused = useRefStateWithDirty(false)

    const makeValue = (value: Option<number>) => {
      return S.make(value)
    }

    const [inputValue, setInputValue] = React.useState<string>(() => makeValue(value))

    const validValue = useRefStateWithDirty(value)

    React.useEffect(() => {
      if (respectFocus ? focused.value() : false) return
      validValue.set(value)
      setInputValue(makeValue(value))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, respectFocus, focused.value()])

    const roundToPrecision = (n: number) => round(n, decimalPrecision)
    const makeValid = flow(adjustValue, roundToPrecision, N.clamp(roundToPrecision(minValue), roundToPrecision(max)))

    const confirmInputValue = (value = validValue.value()) => {
      if (isFiniteNumber(value)) {
        onValueChange(value)
        setInputValue(makeValue(value))
      }
    }

    const setValidValueMaybe = (value: number, updateInputValue = false) => {
      if (Number.isFinite(value)) {
        const validNumber = makeValid(value)
        validValue.set(() => validNumber)

        if (!deferChanges) {
          onValueChange(validNumber)
        }

        if (updateInputValue) {
          confirmInputValue(validNumber)
        }
      }
    }

    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleChange = (value: string) => {
      setInputValue(value)
      setValidValueMaybe(+value)
    }

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      focused.set(true)
      if (props.onFocus) props.onFocus(e)
    }
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      focused.set(false)
      confirmInputValue()
      if (props.onBlur) props.onBlur(e)
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e.target.value)
    }
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentStep = e.shiftKey ? modifierStep : step

      if (e.code === "ArrowUp") {
        e.preventDefault()
        setValidValueMaybe((validValue.value() ?? 0) + currentStep, true)
      }

      if (e.code === "ArrowDown") {
        e.preventDefault()
        setValidValueMaybe((validValue.value() ?? 0) - currentStep, true)
      }

      if (e.code === "Enter") {
        e.preventDefault()
        ;(e.target as HTMLInputElement).blur()
        confirmInputValue()
      }

      if (e.code === "Escape") {
        e.preventDefault()
        validValue.set(value)
        setInputValue(S.make(value))

        setTimeout(() => {
          // eslint-disable-next-line no-extra-semi
          ;(e.target as HTMLInputElement).blur()
        }, 0)
      }
    }

    return (
      <>
        <input
          {...props}
          type='text'
          style={{ ...props.style, touchAction: "none" }}
          ref={mergeRefs([ref, inputRef])}
          value={focused.value() ? inputValue : `${inputValue}${postfix}`}
          spellCheck={false}
          autoComplete='off'
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={variants.input({ icon, size, className })}
        />
      </>
    )
  }
)
InputNumber.displayName = "InputNumber"
