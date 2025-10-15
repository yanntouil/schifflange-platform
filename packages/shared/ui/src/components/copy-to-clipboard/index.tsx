import { Translation, useTranslation } from "@compo/localize"
import { CheckIcon, ClipboardIcon, Copy } from "lucide-react"
import * as React from "react"
import { F } from "@compo/utils"
import { inputIconVariants, inputVariants } from "../../variants"
import { Button, type ButtonProps } from "../button"

const copyToClipboard = async (value: string) => {
  navigator.clipboard.writeText(value)
}

/**
 * CopyButton
 */
export type CopyButtonProps = ButtonProps & {
  value: string
  src?: string
}
const CopyToClipboardButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, className, variant = "ghost", size = "default", ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    const [hasCopied, setHasCopied] = React.useState(false)

    React.useEffect(() => {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }, [hasCopied])

    return (
      <Button
        icon
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        onClick={() => {
          copyToClipboard(value)
          setHasCopied(true)
        }}
        {...props}
      >
        {hasCopied ? <CheckIcon aria-label={_("copied")} /> : <ClipboardIcon aria-label={_("copy")} />}
      </Button>
    )
  }
)
CopyToClipboardButton.displayName = "CopyToClipboardButton"

/**
 * CopyToClipboardInput
 */
export type CopyToClipboardInputProps = React.InputHTMLAttributes<HTMLInputElement> & { value: string }
const CopyToClipboardInput: React.FC<CopyToClipboardInputProps> = ({ value, className, ...props }) => {
  const id = React.useId()
  return (
    <div className='relative'>
      <label className={inputIconVariants({ side: "left", className: "text-muted-foreground" })} htmlFor={id}>
        <Copy aria-hidden />
      </label>
      <input className={inputVariants({ icon: "left" })} id={id} value={value} onChange={F.ignore} {...props} />
      <CopyToClipboardButton
        value={value}
        className={inputIconVariants({ side: "right", className: "text-muted-foreground" })}
      />
    </div>
  )
}

export { CopyToClipboardButton, CopyToClipboardInput }

/**
 * translations
 */
const dictionary = {
  fr: {
    copy: "Cliquez pour copier",
    copied: "Copié",
  },
  en: {
    copy: "Click to copy",
    copied: "Copied",
  },
  de: {
    copy: "Klicken Sie, um zu kopieren",
    copied: "Kopiert",
  },
} satisfies Translation
