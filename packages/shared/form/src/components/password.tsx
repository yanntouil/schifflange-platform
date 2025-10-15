import { Translation, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, VariantProps } from "@compo/utils"
import { Eye, EyeClosed } from "lucide-react"
import React from "react"
import { mergeRefs } from "react-merge-refs"
import {
  extractGroupProps,
  extractInputProps,
  FormA11y,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "."

/**
 * FormInput
 */
export type FormPasswordProps = PasswordInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
const FormPassword = React.forwardRef<HTMLInputElement, FormPasswordProps>(({ classNames, ...props }, ref) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <PasswordInput {...extractInputProps({ ...props })} ref={ref} className={classNames?.input} />
    </FormGroup>
  )
})
FormPassword.displayName = "FormPassword"
export { FormPassword }

type PasswordInputProps = React.ComponentProps<typeof FormA11y.Input> &
  VariantProps<typeof variants.input> & {
    labelIcon?: React.ReactNode
  }
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ size, icon, className, labelIcon, type = "password", ...props }, ref) => {
    const { id, disabled } = useFieldContext()
    const { _ } = useTranslation(dictionary)
    const internalRef = React.useRef<HTMLInputElement>(null)
    const [inputType, setInputType] = React.useState("password")
    const onToggleType = (e: React.MouseEvent<HTMLButtonElement>) => {
      setInputType((t) => (t === "password" ? "text" : "password"))
      internalRef.current?.focus()
    }
    return (
      <div className='relative'>
        {labelIcon && (
          <label
            className={cxm(variants.inputIcon({ size, side: "left", className: "text-muted-foreground" }))}
            htmlFor={id}
          >
            {labelIcon}
          </label>
        )}
        <FormA11y.Input
          {...props}
          disabled={disabled || props.disabled}
          ref={mergeRefs([ref, internalRef])}
          type={inputType}
          className={variants.input({ icon: labelIcon ? "both" : "right", size, className })}
        />
        <Ui.Button
          variant='ghost'
          icon
          onClick={onToggleType}
          className={variants.inputIcon({ size, side: "right" })}
          disabled={disabled || props.disabled}
        >
          {inputType === "password" ? (
            <Eye aria-label={_("toggle-password-visibility")} />
          ) : (
            <EyeClosed aria-label={_("toggle-password-visibility")} />
          )}
        </Ui.Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"
export { PasswordInput }

const dictionary = {
  fr: {
    "toggle-password-visibility": "Afficher le mot de passe",
  },
  en: {
    "toggle-password-visibility": "Show password",
  },
  de: {
    "toggle-password-visibility": "Passwort anzeigen",
  },
  lu: {
    "toggle-password-visibility": "Passwort anzeigen",
  },
} satisfies Translation
