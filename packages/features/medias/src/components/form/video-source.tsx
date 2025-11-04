import {
  Field,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  generateVideoUrl,
  getVideoInfo,
  useFieldContext,
} from "@compo/form"
import { useContainerSize } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { SrOnly } from "@compo/ui/src/components"
import { A, D, F, G, cx, cxm, delay, isUrlValid } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { ChevronsUpDown, FileInput, ImageIcon, PlaySquare, Plus, Popcorn, Trash2, X } from "lucide-react"
import React from "react"
import ReactPlayer from "react-player"
import { FilePreview } from "../files/icon"
import { SelectFilesDialog } from "../files/select"

/**
 * FormVideoSource
 */
type FormVideoSourceProps = InputVideoSourceProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormVideoSource: React.FC<FormVideoSourceProps> = ({ classNames, className, ...props }) => (
  <FormGroup {...extractGroupProps(props)} classNames={classNames}>
    <FieldVideoSource {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
  </FormGroup>
)

/**
 * FieldVideoSource
 */
const FieldVideoSource: React.FC<FormVideoSourceProps> = ({ ...props }) => {
  const { setFieldValue, value, id } = useFieldContext<FormVideoSourceValue>()

  return <InputVideoSource value={value} onValueChange={setFieldValue} id={id} {...props} />
}

/**
 * InputVideoSource
 */
type InputVideoSourceProps = {
  className?: string
  contextKey?: string
}
const InputVideoSource: React.FC<
  InputVideoSourceProps & {
    value: FormVideoSourceValue
    onValueChange: (value: FormVideoSourceValue) => void
    onOpenChange?: (open: boolean) => void
    id?: string
  }
> = (props) => {
  const internId = React.useId()
  const { className, contextKey, value, onValueChange, id = internId, onOpenChange = F.ignore } = props
  const { _ } = useTranslation(dictionary)
  const [activeTab, setActiveTab] = React.useState<Api.VideoType>(value.type)

  const updateValue = (updates: Partial<FormVideoSourceValue>) => {
    onValueChange({ ...value, ...updates })
  }

  const onTabChange = (type: Api.VideoType) => {
    setActiveTab(type)
    updateValue({ type })
  }

  return (
    <div className={cxm("@container/input relative w-full space-y-4", className)}>
      {/* Tabs: Hosted / Embed */}
      <Ui.Tabs.Root
        value={activeTab}
        onValueChange={(v) => onTabChange(v as Api.VideoType)}
        className={cxm("border border-input rounded-md p-4 flex flex-col gap-4")}
      >
        {/* Title Input */}
        <Field.Group label={_("title-label")} id={`${id}-title`}>
          <Field.Text
            id={`${id}-title`}
            value={value.title}
            onValueChange={(title) => updateValue({ title })}
            placeholder={_("title-placeholder")}
          />
        </Field.Group>

        {/* Cover Image */}
        <Field.Group label={_("cover-label")} id={`${id}-cover`}>
          <CoverInput
            id={`${id}-cover`}
            value={value.cover}
            onChange={(cover) => updateValue({ cover })}
            contextKey={contextKey}
            onOpenChange={onOpenChange}
          />
        </Field.Group>

        <Ui.Tabs.List className='grid w-full grid-cols-2'>
          <Ui.Tabs.Trigger value='hosted'>{_("tab-hosted")}</Ui.Tabs.Trigger>
          <Ui.Tabs.Trigger value='embed'>{_("tab-embed")}</Ui.Tabs.Trigger>
        </Ui.Tabs.List>

        <Ui.Tabs.Content value='hosted' className='space-y-4 pt-4'>
          <HostedTab
            value={value.hosted}
            onChange={(hosted) => updateValue({ hosted })}
            contextKey={contextKey}
            onOpenChange={onOpenChange}
          />
        </Ui.Tabs.Content>

        <Ui.Tabs.Content value='embed' className='space-y-4 pt-4'>
          <EmbedTab value={value.embed} onChange={(embed) => updateValue({ embed })} />
        </Ui.Tabs.Content>
      </Ui.Tabs.Root>

      {/* Preview */}
      <VideoPreview value={value} />
    </div>
  )
}

/**
 * CoverInput - Image cover selector
 */
type CoverInputProps = {
  id: string
  value: Api.MediaFileWithRelations | null
  onChange: (value: Api.MediaFileWithRelations | null) => void
  contextKey?: string
  onOpenChange?: (open: boolean) => void
}
const CoverInput: React.FC<CoverInputProps> = ({ id, value, onChange, contextKey, onOpenChange = F.ignore }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const focusRef = React.useRef<HTMLButtonElement>(null)

  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    const file = A.head(files)
    if (G.isNullable(file)) return
    onChange(file)
  }

  const onRemove = () => {
    onChange(null)
    delay(10).then(() => focusRef.current?.focus())
  }

  return (
    <>
      {value ? (
        <div className='flex items-center gap-2 rounded border bg-muted/30 p-2'>
          <FilePreview file={value} />
          <span className='truncate text-sm'>{translate(value, servicePlaceholder.mediaFile).name}</span>
          <Ui.Button type='button' size='xs' icon variant='ghost' onClick={onRemove} className='ml-auto'>
            <X aria-hidden className='size-3.5' />
            <Ui.SrOnly>{_("remove")}</Ui.SrOnly>
          </Ui.Button>
        </div>
      ) : (
        <Ui.Button
          id={id}
          ref={focusRef}
          type='button'
          variant='outline'
          size='sm'
          onClick={() => selectFile(true)}
          className='w-full min-h-12'
        >
          <ImageIcon aria-hidden className='size-4' />
          {_("select-cover")}
        </Ui.Button>
      )}
      <SelectFilesDialog
        {...selectFileProps}
        type='image'
        rootId={value?.folderId ?? undefined}
        onSelect={onSelect}
        persistedKey={contextKey}
      />
    </>
  )
}

/**
 * HostedTab - Hosted video configuration
 */
type HostedTabProps = {
  value: VideoHosted
  onChange: (value: VideoHosted) => void
  contextKey?: string
  onOpenChange: (open: boolean) => void
}
const HostedTab: React.FC<HostedTabProps> = ({ value, onChange, contextKey, onOpenChange }) => {
  const { _ } = useTranslation(dictionary)

  const updateValue = (updates: Partial<VideoHosted>) => onChange({ ...value, ...updates })

  // manage sources
  const addSource = () => updateValue({ sources: A.append(value.sources, { file: null, url: "", type: "video/mp4" }) })
  const updateSource = (at: number, source: VideoSource) =>
    updateValue({ sources: A.updateAt(value.sources, at, () => source) })
  const removeSource = (at: number) => updateValue({ sources: A.removeAt(value.sources, at) })

  // manage tracks
  const addTrack = () =>
    updateValue({ tracks: A.append(value.tracks, { file: null, url: "", type: "subtitles", srclang: "fr" }) })
  const updateTrack = (at: number, track: VideoTrack) =>
    updateValue({ tracks: A.updateAt(value.tracks, at, () => track) })
  const removeTrack = (at: number) => updateValue({ tracks: A.removeAt(value.tracks, at) })

  return (
    <>
      {/* Sources */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between text-sm font-medium'>
          {_("sources-label", { count: value.sources.length })}
          <Ui.Button type='button' size='xs' variant='outline' onClick={addSource}>
            <Plus aria-hidden className='size-3.5' />
            {_("add-source")}
          </Ui.Button>
        </div>
        {value.sources.length === 0 && <p className='text-muted-foreground text-xs'>{_("no-sources")}</p>}
        <div className='space-y-3'>
          {value.sources.map((source, index) => (
            <SourceInput
              key={index}
              value={source}
              onChange={(s) => updateSource(index, s)}
              onRemove={() => removeSource(index)}
              contextKey={contextKey}
              onOpenChange={onOpenChange}
            />
          ))}
        </div>
      </div>

      {/* More options */}
      <Ui.Collapsible.Root defaultOpen={false}>
        <Ui.Collapsible.Trigger className='flex items-center justify-between gap-4 text-sm font-medium w-full py-2'>
          {_("more-options-label")}
          <ChevronsUpDown aria-hidden className='size-3.5' />
        </Ui.Collapsible.Trigger>
        <Ui.Collapsible.Content className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
          <div className='space-y-3 pt-4 border border-input rounded-md p-4'>
            {/* Tracks */}
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>{_("tracks-label", { count: value.tracks.length })}</label>
              <Ui.Button type='button' size='xs' variant='outline' onClick={addTrack}>
                <Plus aria-hidden className='size-3.5' />
                {_("add-track")}
              </Ui.Button>
            </div>
            {value.tracks.length === 0 && <p className='text-muted-foreground text-xs'>{_("no-tracks")}</p>}
            {value.tracks.map((track, index) => (
              <TrackInput
                key={index}
                value={track}
                onChange={(t) => updateTrack(index, t)}
                onRemove={() => removeTrack(index)}
                contextKey={contextKey}
                onOpenChange={onOpenChange}
              />
            ))}
            <DimensionsInput value={D.selectKeys(value, ["width", "height"])} onChange={(d) => updateValue({ ...d })} />
            <TranscriptInput value={value.transcript} onChange={(transcript) => updateValue({ transcript })} />
          </div>
        </Ui.Collapsible.Content>
      </Ui.Collapsible.Root>
    </>
  )
}

/**
 * DimensionsInput - Single video source input
 */
type DimensionsInputProps = {
  value: { width: number; height: number }
  onChange: (value: Partial<{ width: number; height: number }>) => void
}
const DimensionsInput: React.FC<DimensionsInputProps> = ({ value, onChange }) => {
  const { _ } = useTranslation(dictionary)
  const idW = React.useId()
  const idH = React.useId()
  return (
    <div className='grid grid-cols-2 gap-4'>
      <Field.Group label={_("width-label")} id={idW}>
        <Field.Number value={value.width} onValueChange={(width) => onChange({ width })} min={0} />
      </Field.Group>
      <Field.Group label={_("height-label")} id={idH}>
        <Field.Number value={value.height} onValueChange={(height) => onChange({ height })} min={0} />
      </Field.Group>
    </div>
  )
}

/**
 * TranscriptInput - Single video source input
 */
type TranscriptInputProps = {
  value: VideoHosted["transcript"]
  onChange: (value: VideoHosted["transcript"]) => void
}
const TranscriptInput: React.FC<TranscriptInputProps> = ({ value, onChange }) => {
  const { _ } = useTranslation(dictionary)
  const id = React.useId()
  return (
    <Field.Group label={_("transcript-label")} id={id}>
      <Field.Textarea
        value={value}
        onValueChange={(value) => onChange(value)}
        placeholder={_("transcript-placeholder")}
        rows={4}
      />
    </Field.Group>
  )
}

/**
 * SourceInput - Single video source input
 */
type TabValue = "file" | "url"
type SourceInputProps = {
  value: VideoSource
  onChange: (value: VideoSource) => void
  onRemove: () => void
  contextKey?: string
  onOpenChange: (open: boolean) => void
}
const SourceInput: React.FC<SourceInputProps> = ({ value, onChange, onRemove, contextKey, onOpenChange }) => {
  const { _ } = useTranslation(dictionary)
  const [mode, setMode] = React.useState<TabValue>(value.file ? "file" : "url")
  return (
    <div className='space-y-2 rounded-lg border p-3'>
      {/* select file or url */}
      <Ui.Tabs.Root value={mode} onValueChange={(v) => setMode(v as TabValue)}>
        <div className='flex items-center gap-2 justify-between'>
          <Ui.Tabs.List className='h-7'>
            <Ui.Tabs.Trigger value='file' className='text-xs'>
              {_("source-file")}
            </Ui.Tabs.Trigger>
            <Ui.Tabs.Trigger value='url' className='text-xs'>
              {_("source-url")}
            </Ui.Tabs.Trigger>
          </Ui.Tabs.List>
          <Ui.Button type='button' size='xs' variant='ghost' onClick={onRemove}>
            <Trash2 aria-hidden className='size-3.5' />
            <Ui.SrOnly>{_("remove-file")}</Ui.SrOnly>
          </Ui.Button>
        </div>
        <Ui.Tabs.Content value='file'>
          <SourceInputFile
            value={value.file}
            onValueChange={(file) => onChange({ ...value, file })}
            onOpenChange={onOpenChange}
            contextKey={contextKey}
          />
        </Ui.Tabs.Content>
        <Ui.Tabs.Content value='url'>
          <SourceInputUrl value={value.url} onValueChange={(url) => onChange({ ...value, url })} />
        </Ui.Tabs.Content>
      </Ui.Tabs.Root>
      {/* set source options */}
      <SourceInputType value={value.type} onValueChange={(type) => onChange({ ...value, type })} />
    </div>
  )
}

/**
 * SourceInputFile - Single video source file input
 */
type SourceInputFileProps = {
  value: Api.MediaFileWithRelations | null
  onValueChange: (value: Api.MediaFileWithRelations | null) => void
  onOpenChange: (open: boolean) => void
  contextKey?: string
}
const SourceInputFile: React.FC<SourceInputFileProps> = ({ value, onValueChange, onOpenChange, contextKey }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const id = React.useId()
  const focusRef = React.useRef<HTMLButtonElement>(null)

  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    const file = A.head(files)
    if (G.isNullable(file)) return
    onValueChange(file)
  }

  const onRemoveFile = () => {
    onValueChange(null)
    delay(10).then(() => focusRef.current?.focus())
  }
  return (
    <>
      {value ? (
        <div className='flex items-center gap-2 rounded border bg-muted/30 p-2'>
          <FilePreview file={value} />
          <span className='truncate text-xs'>{translate(value, servicePlaceholder.mediaFile).name}</span>
          <Ui.Button type='button' size='xs' variant='ghost' onClick={onRemoveFile} className='ml-auto'>
            <X aria-hidden className='size-3.5' />
            <Ui.SrOnly>{_("remove-file")}</Ui.SrOnly>
          </Ui.Button>
        </div>
      ) : (
        <Ui.Button
          ref={focusRef}
          type='button'
          variant='outline'
          size='sm'
          onClick={() => selectFile(true)}
          className='w-full'
        >
          <FileInput aria-hidden className='size-4' />
          {_("select-file")}
        </Ui.Button>
      )}
      <SelectFilesDialog
        {...selectFileProps}
        type='video'
        rootId={value?.folderId ?? undefined}
        onSelect={onSelect}
        persistedKey={contextKey}
      />
    </>
  )
}

/**
 * SourceInputUrl - Single video source type input
 */
type SourceInputUrlProps = {
  value: string
  onValueChange: (value: string) => void
}
const SourceInputUrl: React.FC<SourceInputUrlProps> = ({ value, onValueChange }) => {
  const { _ } = useTranslation(dictionary)
  const id = React.useId()
  return (
    <Field.Group label={_("source-url-label")} id={id}>
      <Field.Text id={id} value={value} onValueChange={onValueChange} placeholder='https://example.com/video.mp4' />
    </Field.Group>
  )
}

/**
 * SourceInputType - Single video source type input
 */
type SourceInputTypeProps = {
  value: VideoSource["type"]
  onValueChange: (value: VideoSource["type"]) => void
}
const SourceInputType: React.FC<SourceInputTypeProps> = ({ value, onValueChange }) => {
  const { _ } = useTranslation(dictionary)
  const id = React.useId()
  const typeOptions = React.useMemo(
    () => [
      { value: "video/mp4", label: "MP4 (video/mp4)" },
      { value: "video/webm", label: "WebM (video/webm)" },
      { value: "video/ogg", label: "OGG (video/ogg)" },
      { value: "video/quicktime", label: "QuickTime (video/quicktime)" },
      { value: "video/x-matroska", label: "Matroska (video/x-matroska)" },
      { value: "application/vnd.apple.mpegurl", label: "HLS (application/vnd.apple.mpegurl)" },
    ],
    []
  )
  return (
    <Field.Group label={_("source-type-label")} id={id}>
      <Ui.Select.Quick
        value={value}
        onValueChange={(type) => onValueChange(type as VideoSource["type"])}
        options={typeOptions}
        id={id}
      />
    </Field.Group>
  )
}

/**
 * TrackInput - Single video track input
 */
type TrackInputProps = {
  value: VideoTrack
  onChange: (value: VideoTrack) => void
  onRemove: () => void
  contextKey?: string
  onOpenChange: (open: boolean) => void
}
const TrackInput: React.FC<TrackInputProps> = ({ value, onChange, onRemove, contextKey, onOpenChange }) => {
  const { _ } = useTranslation(dictionary)
  const [mode, setMode] = React.useState<TabValue>(value.file ? "file" : "url")

  return (
    <div className='space-y-2 rounded-lg border p-3'>
      {/* select file or url */}
      <Ui.Tabs.Root value={mode} onValueChange={(v) => setMode(v as TabValue)}>
        <div className='flex items-center gap-2 justify-between'>
          <Ui.Tabs.List>
            <Ui.Tabs.Trigger value='file' className='text-xs'>
              {_("track-file")}
            </Ui.Tabs.Trigger>
            <Ui.Tabs.Trigger value='url' className='text-xs'>
              {_("track-url")}
            </Ui.Tabs.Trigger>
          </Ui.Tabs.List>
          <Ui.Button type='button' size='xs' variant='ghost' onClick={onRemove}>
            <Trash2 aria-hidden className='size-3.5' />
          </Ui.Button>
        </div>
        <Ui.Tabs.Content value='file'>
          <TrackInputFile
            value={value.file}
            onValueChange={(file) => onChange({ ...value, file })}
            onOpenChange={onOpenChange}
            contextKey={contextKey}
          />
        </Ui.Tabs.Content>
        <Ui.Tabs.Content value='url'>
          <TrackInputUrl value={value.url} onValueChange={(url) => onChange({ ...value, url })} />
        </Ui.Tabs.Content>
      </Ui.Tabs.Root>
      {/* set track options */}
      <TrackInputType value={value.type} onValueChange={(type) => onChange({ ...value, type })} />
      <TrackInputSrclang value={value.srclang} onValueChange={(srclang) => onChange({ ...value, srclang })} />
    </div>
  )
}

/**
 * TrackFileInput - Single video track file input
 */
type TrackInputFileProps = {
  value: Api.MediaFileWithRelations | null
  onValueChange: (value: Api.MediaFileWithRelations | null) => void
  onOpenChange: (open: boolean) => void
  contextKey?: string
}
const TrackInputFile: React.FC<TrackInputFileProps> = ({ value, onValueChange, onOpenChange, contextKey }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const id = React.useId()
  const focusRef = React.useRef<HTMLButtonElement>(null)

  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    const file = A.head(files)
    if (G.isNullable(file)) return
    onValueChange(file)
  }

  const onRemoveFile = () => {
    onValueChange(null)
    delay(10).then(() => focusRef.current?.focus())
  }
  return (
    <>
      {value ? (
        <div className='flex items-center gap-2 rounded border bg-muted/30 p-2'>
          <FilePreview file={value} />
          <span className='truncate text-xs'>{translate(value, servicePlaceholder.mediaFile).name}</span>
          <Ui.Button type='button' size='xs' variant='ghost' onClick={onRemoveFile} className='ml-auto'>
            <X aria-hidden className='size-3.5' />
            <Ui.SrOnly>{_("remove-file")}</Ui.SrOnly>
          </Ui.Button>
        </div>
      ) : (
        <Ui.Button
          ref={focusRef}
          type='button'
          variant='outline'
          size='sm'
          onClick={() => selectFile(true)}
          className='w-full'
        >
          <FileInput aria-hidden className='size-4' />
          {_("select-file")}
        </Ui.Button>
      )}
      <SelectFilesDialog
        {...selectFileProps}
        type='document'
        rootId={value?.folderId ?? undefined}
        onSelect={onSelect}
        persistedKey={contextKey}
      />
    </>
  )
}

/**
 * TrackUrlInput - Single video track url input
 */
type TrackInputUrlProps = {
  value: string
  onValueChange: (value: string) => void
}
const TrackInputUrl: React.FC<TrackInputUrlProps> = ({ value, onValueChange }) => {
  const { _ } = useTranslation(dictionary)
  const id = React.useId()
  return (
    <Field.Group label={_("track-url")} id={id}>
      <Field.Text id={id} value={value} onValueChange={onValueChange} placeholder='https://example.com/subtitles.vtt' />
    </Field.Group>
  )
}

/**
 * TypeInput - Single video track type input
 */
type TrackInputTypeProps = {
  value: Api.VideoTrackType
  onValueChange: (value: Api.VideoTrackType) => void
}
const TrackInputType: React.FC<TrackInputTypeProps> = ({ value, onValueChange }) => {
  const { _ } = useTranslation(dictionary)
  const id = React.useId()
  const trackTypeOptions = React.useMemo(() => [{ value: "subtitles", label: _("track-type-subtitles") }], [_])
  return (
    <Field.Group label={_("track-type-label")} id={id}>
      <Ui.Select.Quick
        id={id}
        value={value}
        onValueChange={(type) => onValueChange(type as Api.VideoTrackType)}
        options={trackTypeOptions}
      />
    </Field.Group>
  )
}

/**
 * SrclangInput - Single video track srclang input
 */
type TrackInputSrclangProps = {
  value: string
  onValueChange: (value: string) => void
}
const TrackInputSrclang: React.FC<TrackInputSrclangProps> = ({ value, onValueChange }) => {
  const { _ } = useTranslation(dictionary)
  const id = React.useId()
  const srclangOptions = React.useMemo(
    () => [
      { value: "fr", label: "Français (fr)" },
      { value: "de", label: "Deutsch (de)" },
      { value: "en", label: "English (en)" },
      { value: "lb", label: "Lëtzebuergesch (lb)" },
      { value: "nl", label: "Nederlands (nl)" },
      { value: "pt", label: "Português (pt)" },
      { value: "it", label: "Italiano (it)" },
      { value: "es", label: "Español (es)" },
      { value: "pl", label: "Polski (pl)" },
      { value: "ro", label: "Română (ro)" },
    ],
    []
  )
  return (
    <Field.Group label={_("track-srclang-label")} id={id}>
      <Ui.Select.Quick value={value} onValueChange={onValueChange} options={srclangOptions} id={id} />
    </Field.Group>
  )
}

/**
 * EmbedTab - Embed video configuration
 */
type EmbedTabProps = {
  value: Api.VideoEmbed
  onChange: (value: Api.VideoEmbed) => void
}
const EmbedTab: React.FC<EmbedTabProps> = ({ value, onChange }) => {
  const { _ } = useTranslation(dictionary)

  const onUrlChange = (url: string) => {
    const videoInfo = getVideoInfo(url)
    if (videoInfo) {
      onChange({ url, service: videoInfo.service, id: videoInfo.id })
    } else {
      onChange({ url, service: "youtube", id: "" })
    }
  }
  const id = React.useId()
  return (
    <Field.Group label={_("embed-url-label")} id={id} message={_("embed-url-hint")}>
      <Field.Text
        id={id}
        value={value.url}
        onValueChange={(url) => onUrlChange(url)}
        placeholder='https://www.youtube.com/watch?v=...'
      />
    </Field.Group>
  )
}

/**
 * VideoPreview - Preview the video
 */
type VideoPreviewProps = {
  value: FormVideoSourceValue
}
const VideoPreview: React.FC<VideoPreviewProps> = ({ value }) => {
  const { _ } = useTranslation(dictionary)
  const {
    service: { makePath },
  } = useDashboardService()
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useContainerSize(ref as React.RefObject<HTMLElement>)

  const height = React.useMemo(() => {
    return Math.round(size.width * 0.5625)
  }, [size.width])

  const coverUrl = value.cover ? makePath(value.cover.url, true) : undefined

  // Generate proper embed URL
  const embedUrl = React.useMemo(() => {
    if (value.type !== "embed") return ""

    // If we have service and id, generate the embed URL
    if (value.embed.service && value.embed.id) {
      const baseUrl = generateVideoUrl({ service: value.embed.service, id: value.embed.id })
      // For Dailymotion, we need to convert to embed URL
      if (value.embed.service === "dailymotion") {
        return baseUrl.replace("/video/", "/embed/video/")
      }
      return baseUrl
    }

    return value.embed.url
  }, [value.type, value.embed])

  return (
    <div>
      <SrOnly>{_("preview-label")}</SrOnly>
      <div ref={ref} className='overflow-hidden rounded-lg border bg-muted'>
        {value.type === "embed" && embedUrl && isUrlValid(embedUrl) ? (
          <ReactPlayer url={embedUrl} width='100%' height={height} light={coverUrl} controls />
        ) : value.type === "hosted" && value.hosted.sources.length > 0 ? (
          <video
            controls
            poster={coverUrl}
            width='100%'
            height={height}
            className='bg-black'
            style={{ maxHeight: height }}
          >
            {value.hosted.sources.map((source, index) => {
              const src = source.file ? makePath(source.file.url, true) : source.url
              if (!src) return null
              return <source key={index} src={src} type={source.type} />
            })}
            {value.hosted.tracks.map((track, index) => {
              const src = track.file ? makePath(track.file.url, true) : track.url
              if (!src) return null
              return <track key={index} src={src} kind={track.type} srcLang={track.srclang} />
            })}
          </video>
        ) : (
          <div className={cxm(variants.buttonField({ className: "w-full" }))} style={{ height }}>
            <span className='relative' aria-hidden>
              <PlaySquare size={64} strokeWidth={0.5} />
              <span className='bg-muted absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full'>
                <Popcorn size={20} strokeWidth={1.4} />
              </span>
            </span>
            <p className='text-muted-foreground mt-4 text-sm'>{_("preview-empty")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Types
 */
type FormVideoSourceValue = {
  type: Api.VideoType
  title: string
  cover: Api.MediaFileWithRelations | null
  embed: Api.VideoEmbed
  hosted: VideoHosted
}
type VideoHosted = {
  width: number
  height: number
  sources: VideoSource[]
  tracks: VideoTrack[]
  transcript: string
}
type VideoSource = {
  file: Api.MediaFileWithRelations | null
  url: string
  type: Api.VideoMime
}
type VideoTrack = {
  file: Api.MediaFileWithRelations | null
  url: string
  type: Api.VideoTrackType
  srclang: string
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    "title-label": "Titre de la vidéo",
    "title-placeholder": "Entrez un titre...",
    "cover-label": "Image de couverture",
    "tab-hosted": "Hébergée",
    "tab-embed": "Intégrée",
    optional: "optionnel",
    "select-cover": "Sélectionner une image de couverture",
    remove: "Supprimer",
    info: "Informations sur le fichier",
    "more-options-label": "Plus d'options",
    "sources-label": "Sources vidéo ({{count}})",
    "add-source": "Ajouter une source",
    "no-sources": "Aucune source vidéo ajoutée",
    "source-file": "Fichier",
    "source-url": "URL",
    "source-url-label": "URL de la source",
    "select-file": "Sélectionner un fichier",
    "remove-file": "Supprimer le fichier",
    "source-type-label": "Type MIME",
    "tracks-label": "Pistes de sous-titres ({{count}})",
    "add-track": "Ajouter une piste",
    "no-tracks": "Aucune piste ajoutée",
    "track-file": "Fichier",
    "track-url": "URL",
    "track-type-label": "Type",
    "track-type-subtitles": "Sous-titres",
    "track-srclang-label": "Langue",
    "width-label": "Largeur (px)",
    "height-label": "Hauteur (px)",
    "transcript-label": "Transcription",
    "transcript-placeholder": "Transcription complète de la vidéo...",
    "embed-url-label": "URL de la vidéo",
    "embed-url-hint": "Supporte YouTube, Vimeo, Dailymotion, etc.",
    "preview-label": "Aperçu",
    "preview-empty": "Configurez une source pour voir l'aperçu",
  },
  en: {
    "title-label": "Video title",
    "title-placeholder": "Enter a title...",
    "cover-label": "Cover image",
    "tab-hosted": "Hosted",
    "tab-embed": "Embed",
    optional: "optional",
    "select-cover": "Select cover image",
    remove: "Remove",
    info: "File information",
    "more-options-label": "More options",
    "sources-label": "Video sources ({{count}})",
    "add-source": "Add source",
    "no-sources": "No video sources added",
    "source-file": "File",
    "source-url": "URL",
    "source-url-label": "Source URL",
    "select-file": "Select file",
    "remove-file": "Remove file",
    "source-type-label": "MIME type",
    "tracks-label": "Tracks subtitles ({{count}})",
    "add-track": "Add track",
    "no-tracks": "No tracks added",
    "track-file": "File",
    "track-url": "URL",
    "track-type-label": "Type",
    "track-type-subtitles": "Subtitles",
    "track-srclang-label": "Language",
    "width-label": "Width (px)",
    "height-label": "Height (px)",
    "transcript-label": "Transcript",
    "transcript-placeholder": "Full video transcript...",
    "embed-url-label": "Video URL",
    "embed-url-hint": "Supports YouTube, Vimeo, Dailymotion, etc.",
    "preview-label": "Preview",
    "preview-empty": "Configure a source to see preview",
  },
  de: {
    "title-label": "Video-Titel",
    "title-placeholder": "Titel eingeben...",
    "cover-label": "Titelbild",
    "tab-hosted": "Gehostet",
    "tab-embed": "Eingebettet",
    optional: "optional",
    "select-cover": "Titelbild auswählen",
    remove: "Entfernen",
    info: "Dateiinformationen",
    "more-options-label": "Mehr Optionen",
    "sources-label": "Videoquellen ({{count}})",
    "add-source": "Quelle hinzufügen",
    "no-sources": "Keine Videoquellen hinzugefügt",
    "source-file": "Datei",
    "source-url": "URL",
    "source-url-label": "Quellen-URL",
    "select-file": "Datei auswählen",
    "remove-file": "Datei entfernen",
    "source-type-label": "MIME-Typ",
    "tracks-label": "Spuren de Untertitel ({{count}})",
    "add-track": "Spur hinzufügen",
    "no-tracks": "Keine Spuren hinzugefügt",
    "track-file": "Datei",
    "track-url": "URL",
    "track-type-label": "Typ",
    "track-type-subtitles": "Untertitel",
    "track-srclang-label": "Sprache",
    "width-label": "Breite (px)",
    "height-label": "Höhe (px)",
    "transcript-label": "Transkription",
    "transcript-placeholder": "Vollständige Video-Transkription...",
    "embed-url-label": "Video-URL",
    "embed-url-hint": "Unterstützt YouTube, Vimeo, Dailymotion, etc.",
    "preview-label": "Vorschau",
    "preview-empty": "Quelle konfigurieren für Vorschau",
  },
}
