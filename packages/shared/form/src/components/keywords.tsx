import { Ui, variants } from "@compo/ui"
import { cxm } from "@compo/utils"
import { A, S } from "@mobily/ts-belt"
import { CornerDownLeft, X } from "lucide-react"
import React from "react"
import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "."

/**
 * FormKeywords
 */
type Props = FieldKeywordsProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<FieldKeywordsProps["classNames"]>
  }
export const FormKeywords: React.FC<Props> = ({ classNames, ...props }) => (
  <FormGroup {...extractGroupProps(props)} classNames={classNames}>
    <FieldKeywords {...extractInputProps(props)} classNames={classNames} />
  </FormGroup>
)

/**
 *
 */
type FieldKeywordsProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "name" | "id" | "onChange" | "value" | "disabled" | "children" | "type" | "onKeyDown"
> & {
  classNames?: {
    // todo: add classNames
  }
}
const FieldKeywords: React.FC<FieldKeywordsProps> = ({ classNames, ...props }) => {
  const { value, setFieldValue, disabled, name, id } = useFieldContext<string[]>()
  const ref = React.useRef<HTMLInputElement>(null)
  const [state, setState] = React.useState("")

  const focusInput = () => {
    ref.current?.focus()
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value)
  }

  const addKeywords = React.useCallback(
    (text: string) => {
      const keywords = text
        .split(",")
        .map((k) => S.trim(k))
        .filter((k) => S.isNotEmpty(k))

      if (A.isNotEmpty(keywords)) {
        setFieldValue(A.concat(value, keywords))
        setState("")
      }
    },
    [value, setFieldValue]
  )

  const onInputPaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData("text")

      if (pastedText.includes(",")) {
        e.preventDefault()
        addKeywords(pastedText)
      }
    },
    [addKeywords]
  )

  const onInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!["Enter", "Backspace"].includes(e.key)) return
      if (e.key === "Enter") {
        addKeywords(state)
        e.preventDefault()
      }
      if (e.key === "Backspace" && S.isEmpty(state) && A.isNotEmpty(value)) {
        setFieldValue(A.removeAt(value, value.length - 1))
        e.preventDefault()
      }
    },
    [state, value, setFieldValue, addKeywords]
  )

  const onButtonKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (!["Enter", " "].includes(e.key)) return
      e.preventDefault()
      setFieldValue(A.removeAt(value, index))
      focusInput()
    },
    [setFieldValue, value]
  )

  const onButtonClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
      e.stopPropagation()
      setFieldValue(A.removeAt(value, index))
      focusInput()
    },
    [setFieldValue, value]
  )

  return (
    <div
      onClick={focusInput}
      className={cxm(
        "relative flex w-full flex-wrap gap-y-2 rounded-[2px] px-3 py-2",
        "box-border",
        variants.inputBackground(),
        variants.inputBorder(),
        "ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {A.mapWithIndex(value, (index, text) => (
        <Ui.Button
          key={index}
          onClick={(e) => onButtonClick(e, index)}
          onKeyDown={(e) => onButtonKeyDown(e, index)}
          disabled={disabled}
          size='xs'
          variant='outline'
          className={cxm("mr-3 h-auto py-1 leading-none")}
        >
          {text}
          <X size={12} aria-hidden />
        </Ui.Button>
      ))}
      <input
        className={cxm(
          "-mx-3 -my-2 h-[44px] min-w-[33%] grow px-3 pr-[52px]",
          "bg-transparent",
          "text-sm font-normal placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "outline-none"
        )}
        ref={ref}
        name={name}
        id={id}
        type='text'
        value={state}
        disabled={disabled}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        onPaste={onInputPaste}
        {...props}
      />
      <Ui.Kbd.Shortcut desktopOnly className='absolute bottom-3 right-3'>
        <CornerDownLeft className='size-2.5' aria-label='Enter' />
      </Ui.Kbd.Shortcut>
    </div>
  )
}
