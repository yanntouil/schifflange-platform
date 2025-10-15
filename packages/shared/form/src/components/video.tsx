import { useElementSize } from "@compo/hooks"
import { variants } from "@compo/ui"
import { cxm, match } from "@compo/utils"
import { PlaySquare, Popcorn } from "lucide-react"
import React from "react"
import ReactPlayer from "react-player"
import {
  extractGroupProps,
  extractInputProps,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  generateVideoUrl,
  getVideoInfo,
  useFieldContext,
} from "."

/**
 * FormVideo
 */
export type FormVideoProps = FieldVideoProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormVideo: React.FC<FormVideoProps> = ({ classNames, ...props }) => (
  <FormGroup {...extractGroupProps(props)} classNames={classNames}>
    <FieldVideo {...extractInputProps({ ...props })} className={classNames?.input} />
  </FormGroup>
)

/**
 * FieldVideo
 */
type FieldVideoProps = {
  disabled?: boolean
  placeholder?: string
  className?: string
}
const FieldVideo: React.FC<FieldVideoProps> = ({ disabled, ...props }) => {
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<FormVideoValue>()
  return <VideoInput onValueChange={setFieldValue} value={value} {...props} />
}

/**
 * VideoInput
 */
type VideoInputProps = FieldVideoProps & {
  value: FormVideoValue
  onValueChange: (value: FormVideoValue) => void
}

const VideoInput: React.FC<VideoInputProps> = ({ className, disabled, placeholder, value, onValueChange }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = getVideoInfo(e.target.value)
    if (video) {
      onValueChange({ ...value, url: e.target.value, service: video.service, id: video.id })
    } else {
      onValueChange({ ...value, url: e.target.value, service: null, id: "" })
    }
  }
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(ref)
  const { height } = React.useMemo(() => {
    return {
      width: Math.round(size[0]),
      height: Math.round(size[0] * 0.5625),
    }
  }, [size[0]])
  return (
    <div className='space-y-4' ref={ref}>
      <input
        type='string'
        onChange={onChange}
        value={value.url}
        placeholder={placeholder}
        disabled={disabled}
        className={cxm(variants.input({ className }))}
      />
      {match(value)
        .with({ service: "youtube" }, ({ id }) => (
          <ReactPlayer
            url={generateVideoUrl({ service: "youtube", id })}
            width='100%'
            height={height}
            options={{ autoplay: false }}
          />
        ))
        .otherwise(() => (
          <div className={cxm(variants.buttonField({ className: "w-full" }))} style={{ height }}>
            <span className='relative' aria-hidden>
              <PlaySquare size={64} strokeWidth={0.5} />
              <span className='absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-muted'>
                <Popcorn size={20} strokeWidth={1.4} />
              </span>
            </span>
          </div>
        ))}
    </div>
  )
}

export type FormVideoValue = {
  url: string
  service: NonNullable<ReturnType<typeof getVideoInfo>>["service"] | null
  id: string
}
