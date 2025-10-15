import {
  Form,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, F, G, cx, cxm, delay } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { EllipsisVertical, FileInput, FileMinus, Info, TriangleAlert, VideoIcon } from "lucide-react"
import React from "react"
import { FileInfoDialog } from "../dialogs/file-info"
import { SelectFilesDialog } from "../files/select"

/**
 * FormMediaVideo
 */
type FormMediaVideoProps = FieldMediaVideoProps & {
  noWrapper?: boolean
} & FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormMediaVideo: React.FC<FormMediaVideoProps> = ({
  classNames,
  className,
  noWrapper = false,
  ...props
}) =>
  noWrapper ? (
    <Form.Fields name={props.name}>
      <FieldMediaVideo {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </Form.Fields>
  ) : (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldMediaVideo {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </FormGroup>
  )

/**
 * FieldMediasVideo
 */
const FieldMediaVideo: React.FC<FieldMediaVideoProps> = ({ ...props }) => {
  const { setFieldValue, value, id } = useFieldContext<Api.MediaFileWithRelations | null>()

  return <InputMediaVideo value={value} onValueChange={setFieldValue} id={id} {...props} />
}

/**
 * MediaVideoInput
 */
type FieldMediaVideoProps = {
  ratio?: string
  className?: string
  fit?: string
  contextKey?: string
}
const InputMediaVideo: React.FC<
  FormMediaVideoProps & {
    value: Api.MediaFileWithRelations | null
    onValueChange: (value: Api.MediaFileWithRelations | null) => void
    onOpenChange?: (open: boolean) => void
    id?: string
  }
> = ({
  ratio = "aspect-video",
  fit = "object-cover",
  className,
  contextKey,
  value,
  onValueChange,
  id,
  onOpenChange = F.ignore,
}) => {
  const { _ } = useTranslation(dictionnary)
  const { translate } = useLanguage()
  const {
    service: { makePath },
  } = useDashboardService()

  const onRemove = () => {
    onValueChange(null)
    delay(10).then(() => focusRef.current?.focus())
  }

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    const file = A.head(files)
    if (G.isNullable(file)) return
    onValueChange(file)
  }

  const focusRef = React.useRef<HTMLButtonElement>(null)

  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const [openInfo, openInfoProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  return (
    <div className={cxm("@container/input relative grid w-full", ratio, className)}>
      {G.isNotNullable(value) ? (
        <>
          <Ui.Video
            src={makePath(value.url, true)}
            aria-label={translate(value, servicePlaceholder.mediaFile).name}
            classNames={{ wrapper: cx("size-full bg-muted", ratio) }}
            className={cx("size-full", ratio, fit)}
          >
            <TriangleAlert
              aria-hidden
              className='text-input-foreground/80 size-8 stroke-[0.8] @sm/input:size-10 @md/input:size-12 @lg/input:size-16'
            />
          </Ui.Video>
          <Ui.DropdownMenu.Quick
            menu={
              <>
                <Ui.Menu.Item onClick={() => openInfo(value)}>
                  <Info aria-hidden />
                  {_("info")}
                </Ui.Menu.Item>
                <Ui.Menu.Item onClick={onRemove}>
                  <FileMinus aria-hidden />
                  {_("remove")}
                </Ui.Menu.Item>
                <Ui.Menu.Item onClick={() => selectFile(true)}>
                  <FileInput aria-hidden />
                  {_("change")}
                </Ui.Menu.Item>
              </>
            }
            align='start'
            side='left'
          >
            <Ui.Button
              ref={focusRef}
              variant='overlay'
              size='xxs'
              icon
              className='absolute top-2 right-2 backdrop-blur'
            >
              <EllipsisVertical aria-hidden />
              <Ui.SrOnly>{_("more")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.DropdownMenu.Quick>
          <FileInfoDialog {...openInfoProps} onCloseAutoFocus={() => focusRef.current?.focus()} />
        </>
      ) : (
        <>
          <button
            ref={focusRef}
            className={cxm(variants.buttonField({ className: "size-full" }))}
            id={id}
            onClick={() => selectFile(true)}
            type='button'
          >
            <VideoIcon
              aria-hidden
              className='size-8 stroke-[0.8] @sm/input:size-10 @md/input:size-12 @lg/input:size-16'
            />
            <Ui.SrOnly>{_("add")}</Ui.SrOnly>
          </button>
        </>
      )}
      <SelectFilesDialog
        {...selectFileProps}
        type='video'
        rootId={value?.folderId ?? undefined}
        onSelect={onSelect}
        persistedKey={contextKey}
      />
    </div>
  )
}

const dictionnary = {
  fr: {
    add: "Ajouter une vidéo",
    change: "Changer la vidéo",
    remove: "Supprimer la vidéo",
    info: "Informations sur le fichier",
    more: "Plus d'options",
  },
  en: {
    add: "Add a video",
    change: "Change video",
    remove: "Remove video",
    info: "File information",
    more: "More options",
  },
  de: {
    add: "Video hinzufügen",
    change: "Video ändern",
    remove: "Video entfernen",
    info: "Dateiinformationen",
    more: "Mehr Optionen",
  },
}
