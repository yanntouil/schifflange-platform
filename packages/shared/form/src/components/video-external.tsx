import { useContainerSize } from "@compo/hooks"
import { variants } from "@compo/ui"
import { cxm, isUrlValid, S } from "@compo/utils"
import { PlaySquare, Popcorn } from "lucide-react"
import React from "react"
import ReactPlayer from "react-player"
import {
  extractGroupProps,
  extractInputProps,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "."

/**
 * FormVideoExternal
 */
export type FormVideoExternalProps = FieldVideoExternalProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormVideoExternal: React.FC<FormVideoExternalProps> = ({ classNames, ...props }) => (
  <FormGroup {...extractGroupProps(props)} classNames={classNames}>
    <FieldVideoExternal {...extractInputProps({ ...props })} className={classNames?.input} />
  </FormGroup>
)

/**
 * FieldVideoExternal
 */
type FieldVideoExternalProps = {
  disabled?: boolean
  placeholder?: string
  className?: string
}
const FieldVideoExternal: React.FC<FieldVideoExternalProps> = ({ disabled, ...props }) => {
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string>()
  return <VideoExternalInput onValueChange={setFieldValue} value={value} {...props} />
}

/**
 * VideoExternalInput
 */
type VideoExternalInputProps = FieldVideoExternalProps & {
  value: string
  onValueChange: (value: string) => void
}

const VideoExternalInput: React.FC<VideoExternalInputProps> = ({
  className,
  disabled,
  placeholder,
  value,
  onValueChange,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useContainerSize(ref as React.RefObject<HTMLElement>)
  const { width, height } = React.useMemo(() => {
    return {
      width: Math.round(size.width),
      height: Math.round(size.width * 0.5625),
    }
  }, [size.width])
  const isValid = (value: string) => {
    if (S.startsWith(value, "blob:")) return isUrlValid(S.replace(value, "blob:", ""))
    return isUrlValid(value)
  }
  return (
    <div className='space-y-4' ref={ref}>
      <input
        type='string'
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={cxm(variants.input({ className }))}
      />
      {isUrlValid(value) ? (
        <ReactPlayer url={value} width='100%' height={height} options={{ autoplay: false }} />
      ) : (
        <div className={cxm(variants.buttonField({ className: "w-full" }))} style={{ height }}>
          <span className='relative' aria-hidden>
            <PlaySquare size={64} strokeWidth={0.5} />
            <span className='absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-muted'>
              <Popcorn size={20} strokeWidth={1.4} />
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
