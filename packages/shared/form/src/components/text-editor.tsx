import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, isUrlValid, match, prependHttp, shallow } from "@compo/utils"
import Blockquote from "@tiptap/extension-blockquote"
import Link from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { Editor, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  ALargeSmall,
  BoldIcon,
  ChevronsUpDown,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  HeadingIcon,
  ItalicIcon,
  Link2,
  Link2Off,
  ListIcon,
  ListOrderedIcon,
  LucideIcon,
  PilcrowIcon,
  Redo,
  StrikethroughIcon,
  TextQuoteIcon,
  UnderlineIcon,
  Undo,
} from "lucide-react"
import React from "react"
import { useField } from "use-a11y-form"
import { extractGroupProps, extractInputProps, FormGroup, FormGroupProps } from "."

/**
 * Form text editor
 */
const disallowedDomains = ["example-phishing.com", "malicious-site.net"]
export type FormTextEditorProps = FormGroupProps & FieldTextEditorProps

export const FormTextEditor: React.FC<FormTextEditorProps> = ({ classNames, ...props }) => {
  // Extract props correctly including prose
  const inputProps = extractInputProps(props)

  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldTextEditor {...inputProps} />
    </FormGroup>
  )
}

/**
 * Form text editor
 */
type FieldTextEditorProps = { placeholder?: string; lang?: string; prose?: string }
export const FieldTextEditor: React.FC<FieldTextEditorProps> = ({ ...props }) => {
  const field = useField<string>()
  return <TextEditor value={field.value} id={field.id} key={field.id} onValueChange={field.onChange} {...props} />
}

/**
 * Text editor
 */
type TextEditorProps = {
  value: string
  onValueChange: (value: string) => void
} & FieldTextEditorProps
const TextEditor: React.FC<TextEditorProps & React.ComponentProps<"div">> = (props) => {
  const { value, onValueChange, prose = "mini-prose", className, ...editorProps } = props
  const editor = useEditor({
    extensions: editorExtensions,
    content: value,
    onUpdate({ editor }) {
      onValueChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className='text-sm'>
      <EditorBar editor={editor} />

      <EditorContent
        editor={editor}
        {...editorProps}
        className={cxm(
          variants.inputBorder(),
          variants.inputBackground(),
          variants.inputShadow(),
          "h-auto resize-none rounded-[2px] outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent [&>.tiptap]:px-3 [&>.tiptap]:py-3 [&>.tiptap]:outline-none",
          prose,
          className
        )}
      />
    </div>
  )
}

/**
 * Editor bar
 */

export const EditorBar: React.FC<{ editor: Editor } & React.ComponentProps<"div">> = (props) => {
  const { _ } = useTranslation(dictionary)

  const { editor, ...elProps } = props

  const [value, setValue] = React.useState({ link: "", openInNewTab: false })
  const [showLink, setShowLink] = React.useState(false)

  const openLinkDialog = () => {
    setValue(
      shallow({
        link: editor.getAttributes("link").href ? prependHttp(editor.getAttributes("link").href) : "",
        openInNewTab: editor.getAttributes("link").target === "_blank" ? true : false,
      })
    )
    setShowLink(true)
  }

  const activeFormat = getFormat(editor)
  return (
    <div {...elProps} className={cxm(elProps.className, "mb-2 flex gap-0.5")}>
      <LinkDialog editor={editor} open={showLink} onOpenChange={setShowLink} />

      <TiptapIconButton
        tooltip={_("bold")}
        windows='Ctrl B'
        mac='⌘ B'
        Icon={BoldIcon}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      />

      <TiptapIconButton
        tooltip={_("italic")}
        windows='^ I'
        mac='⌘ I'
        Icon={ItalicIcon}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      />

      <TiptapIconButton
        tooltip={_("strikethrough")}
        windows='^ ⇧ S'
        mac='⌘ ⇧ S'
        Icon={StrikethroughIcon}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      />

      <TiptapIconButton
        tooltip={_("underline")}
        windows='^ U'
        mac='⌘ U'
        Icon={UnderlineIcon}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      />

      <Ui.DropdownMenu.Root>
        <Ui.DropdownMenu.Trigger asChild>
          <TiptapIconButton tooltip={_("format", { format: _(activeFormat) })}>
            <ALargeSmall aria-label={_(activeFormat)} className='!size-6 stroke-[1.1]' />
            <ChevronsUpDown aria-hidden className='!size-3 opacity-75' />
          </TiptapIconButton>
        </Ui.DropdownMenu.Trigger>
        <FormatMenu editor={editor} />
      </Ui.DropdownMenu.Root>

      <TiptapIconButton
        Icon={Link2}
        tooltip={editor.isActive("link") ? _("link.edit") : _("link.add")}
        onClick={openLinkDialog}
        active={editor.isActive("link")}
      />

      <TiptapIconButton
        Icon={Link2Off}
        tooltip={_("link.unset")}
        onClick={() => editor.chain().focus().unsetLink().run()}
        hidden={!editor.isActive("link")}
      />

      <TiptapIconButton
        Icon={Undo}
        tooltip={_("undo")}
        windows='^ Z'
        mac='⌘ Z'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className='ml-auto'
      />

      <TiptapIconButton
        Icon={Redo}
        tooltip={_("redo")}
        windows='^ ⇧ Z'
        mac='⌘ ⇧ Z'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      />
    </div>
  )
}

/**
 * Tiptap icon button
 */
type TiptapIconButtonProps = React.ComponentProps<"button"> & {
  Icon?: LucideIcon
  tooltip: string
  active?: boolean
  hidden?: boolean
  children?: React.ReactNode
  windows?: string
  mac?: string
}
const TiptapIconButton = React.forwardRef<HTMLButtonElement, TiptapIconButtonProps>(
  ({ Icon, tooltip, onClick, active = false, hidden = false, className, children, windows, mac, ...props }, ref) => {
    const hasIcon = !!Icon
    if (hidden) return null
    const isMac = navigator.userAgent.includes("Mac")
    const isWindows = navigator.userAgent.includes("Windows")
    return (
      <Ui.Tooltip.Quick
        tooltip={
          <>
            {tooltip}
            <span className='ml-4 text-xs text-muted'>
              {isMac && mac}
              {isWindows && windows}
            </span>
          </>
        }
        asChild
      >
        <Ui.Button
          {...props}
          icon={hasIcon}
          onClick={onClick}
          variant='ghost'
          size='sm'
          ref={ref}
          className={cxm(active && "border border-input", className)}
        >
          {hasIcon && <Icon aria-label={tooltip} />}
          {children}
          <Ui.SrOnly>{tooltip}</Ui.SrOnly>
        </Ui.Button>
      </Ui.Tooltip.Quick>
    )
  }
)

/**
 * dialog to append or update link
 */
const LinkDialog: React.FC<{ editor: Editor; open: boolean; onOpenChange: (open: boolean) => void }> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { open, onOpenChange } = props
  return (
    <Ui.QuickDialog
      title={_("link.label")}
      open={open}
      onOpenChange={onOpenChange}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      <LinkForm {...props} />
    </Ui.QuickDialog>
  )
}
const LinkForm: React.FC<{ editor: Editor; open: boolean; onOpenChange: (open: boolean) => void }> = ({
  editor,
  open,
  onOpenChange,
}) => {
  const { _ } = useTranslation(dictionary)
  const [value, setValue] = React.useState({
    link: editor.getAttributes("link").href ?? "",
    openInNewTab: false,
  })

  // apply link to selection
  const applyLink = () => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: prependHttp(value.link), target: value.openInNewTab ? "_blank" : "_self" })
      .run()

    onOpenChange(false)
  }

  const disabled = !(isUrlValid(value.link) || value.link.startsWith("tel:") || value.link.startsWith("mailto:"))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        applyLink()
      }}
    >
      <div className='flex flex-col gap-4 px-6 py-3'>
        <Ui.Input
          placeholder={_("link.placeholder")}
          value={value.link}
          onChange={(e) => setValue(shallow({ link: e.target.value }))}
        />

        <div className='flex select-none items-center gap-2 text-xs'>
          <Ui.Checkbox
            checked={value.openInNewTab}
            onCheckedChange={(openInNewTab) => setValue(shallow({ openInNewTab: openInNewTab === true }))}
            size='sm'
            id='open-in-new-tab'
          />
          <label htmlFor='open-in-new-tab'>{_("link.open-in-new-tab")}</label>
        </div>
      </div>

      <Ui.QuickDialogStickyFooter>
        <Ui.Button onClick={() => onOpenChange(false)}> {_("link.cancel")}</Ui.Button>
        <Ui.Button type='submit' disabled={disabled}>
          {_("link.save")}
        </Ui.Button>
      </Ui.QuickDialogStickyFooter>
    </form>
  )
}

/**
 * menu to select format
 */
const FormatMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const { _ } = useTranslation(dictionary)
  const activeFormat = getFormat(editor)
  return (
    <Ui.Menu.Content onCloseAutoFocus={(e) => e.preventDefault()} className='min-w-[248px]'>
      <Ui.Menu.Item onClick={() => editor.chain().focus().setParagraph().run()} active={activeFormat === "paragraph"}>
        <FormatIcon format='paragraph' bold={activeFormat === "paragraph"} />
        {_("paragraph")}
        <Ui.Menu.Shortcut mac='⌘ ⌥ 0' windows='⌃ ⌥ 0' />
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <HeadingIcon aria-hidden />
          {_("heading")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.Portal>
          <Ui.Menu.SubContent className='min-w-[200px]'>
            <Ui.Menu.Item
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive("heading", { level: 1 })}
            >
              <FormatIcon format='heading1' bold={editor.isActive("heading", { level: 1 })} />
              {_("heading1")}
              <Ui.Menu.Shortcut mac='⌘ ⌥ 1' windows='⌃ ⌥ 1' />
            </Ui.Menu.Item>
            <Ui.Menu.Item
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive("heading", { level: 2 })}
            >
              <FormatIcon format='heading2' bold={editor.isActive("heading", { level: 2 })} />
              {_("heading2")}
              <Ui.Menu.Shortcut mac='⌘ ⌥ 2' windows='⌃ ⌥ 2' />
            </Ui.Menu.Item>
            <Ui.Menu.Item
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive("heading", { level: 3 })}
            >
              <FormatIcon format='heading3' bold={editor.isActive("heading", { level: 3 })} />
              {_("heading3")}
              <Ui.Menu.Shortcut mac='⌘ ⌥ 3' windows='⌃ ⌥ 3' />
            </Ui.Menu.Item>
            <Ui.Menu.Item
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              active={editor.isActive("heading", { level: 4 })}
            >
              <FormatIcon format='heading4' bold={editor.isActive("heading", { level: 4 })} />
              {_("heading4")}
              <Ui.Menu.Shortcut mac='⌘ ⌥ 4' windows='⌃ ⌥ 4' />
            </Ui.Menu.Item>
            <Ui.Menu.Item
              onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
              active={editor.isActive("heading", { level: 5 })}
            >
              <FormatIcon format='heading5' bold={editor.isActive("heading", { level: 5 })} />
              {_("heading5")}
              <Ui.Menu.Shortcut mac='⌘ ⌥ 5' windows='⌃ ⌥ 5' />
            </Ui.Menu.Item>
            <Ui.Menu.Item
              onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
              active={editor.isActive("heading", { level: 6 })}
            >
              <FormatIcon format='heading6' bold={editor.isActive("heading", { level: 6 })} />
              {_("heading6")}
              <Ui.Menu.Shortcut mac='⌘ ⌥ 6' windows='⌃ ⌥ 6' />
            </Ui.Menu.Item>
          </Ui.Menu.SubContent>
        </Ui.Menu.Portal>
      </Ui.Menu.Sub>

      <Ui.Menu.Item
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <FormatIcon format='ordered-list' bold={editor.isActive("orderedList")} />
        {_("ordered-list")}
        <Ui.Menu.Shortcut mac='⌘ ⇧ 7' windows='⌃ ⇧ 7' />
      </Ui.Menu.Item>
      <Ui.Menu.Item
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <FormatIcon format='bullet-list' bold={editor.isActive("bulletList")} />
        {_("bullet-list")}
        <Ui.Menu.Shortcut mac='⌘ ⇧ 8' windows='⌃ ⇧ 8' />
      </Ui.Menu.Item>

      <Ui.Menu.Item
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <FormatIcon format='blockquote' bold={editor.isActive("blockquote")} />
        {_("blockquote")}
        <Ui.Menu.Shortcut mac='⌘ ⇧ B' windows='⌃ ⇧ B' />
      </Ui.Menu.Item>
    </Ui.Menu.Content>
  )
}

/**
 * display format icon related to the format, bold if active
 */
const FormatIcon: React.FC<{ format: string; bold?: boolean }> = ({ format, bold = false }) => {
  const cx = bold ? "stroke-[2.5]" : "stroke-[2]"
  return match(format)
    .with("heading1", () => <Heading1Icon aria-hidden className={cx} />)
    .with("heading2", () => <Heading2Icon aria-hidden className={cx} />)
    .with("heading3", () => <Heading3Icon aria-hidden className={cx} />)
    .with("heading4", () => <Heading4Icon aria-hidden className={cx} />)
    .with("heading5", () => <Heading5Icon aria-hidden className={cx} />)
    .with("heading6", () => <Heading6Icon aria-hidden className={cx} />)
    .with("bullet-list", () => <ListIcon aria-hidden className={cx} />)
    .with("ordered-list", () => <ListOrderedIcon aria-hidden className={cx} />)
    .with("blockquote", () => <TextQuoteIcon aria-hidden className={cx} />)
    .otherwise(() => <PilcrowIcon aria-hidden className={cx} />)
}

/**
 * get format from editor
 */
const getFormat = (editor: Editor) => {
  switch (true) {
    case editor.isActive("heading", { level: 1 }):
      return "heading1"
    case editor.isActive("heading", { level: 2 }):
      return "heading2"
    case editor.isActive("heading", { level: 3 }):
      return "heading3"
    case editor.isActive("heading", { level: 4 }):
      return "heading4"
    case editor.isActive("heading", { level: 5 }):
      return "heading5"
    case editor.isActive("heading", { level: 6 }):
      return "heading6"
    case editor.isActive("bulletList"):
      return "bullet-list"
    case editor.isActive("orderedList"):
      return "ordered-list"
    case editor.isActive("blockquote"):
      return "blockquote"
    default:
      return "paragraph"
  }
}

const editorExtensions = [
  TextStyle.configure(), //{ types: [ListItem.name] }
  Underline.configure(),
  Blockquote.configure(),
  StarterKit.configure({
    bulletList: {},
    orderedList: {},
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: [
      {
        scheme: "tel",
        optionalSlashes: true,
      },
      {
        scheme: "mailto",
        optionalSlashes: true,
      },
      "http",
      "https",
    ],
    isAllowedUri: (url, ctx) => {
      try {
        if (url.startsWith("tel:") || url.startsWith("mailto:")) {
          return true // handled early and allowed
        }

        // construct URL
        const parsedUrl = new URL(url.includes("://") ? url : `${ctx.defaultProtocol}://${url}`)

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false
        }

        // disallowed protocols
        const disallowedProtocols = ["ftp", "file"]
        const protocol = parsedUrl.protocol.replace(":", "")

        if (disallowedProtocols.includes(protocol)) {
          return false
        }

        // only allow protocols specified in ctx.protocols
        const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme))

        if (!allowedProtocols.includes(protocol)) {
          return false
        }

        // disallowed domains
        const domain = parsedUrl.hostname
        if (disallowedDomains.includes(domain)) {
          return false
        }

        // all checks have passed
        return true
      } catch (error) {
        return false
      }
    },
    shouldAutoLink: (url) => {
      try {
        if (url.startsWith("tel:") || url.startsWith("mailto:")) {
          return true
        }
        // construct URL
        const parsedUrl = new URL(url.includes("://") ? url : `https://${url}`)
        const domain = parsedUrl.hostname

        // only auto-link if the domain is not in the disallowed list
        return !disallowedDomains.includes(domain)
      } catch (error) {
        return false
      }
    },
  }),
]

/**
 * translations
 */
const dictionary = {
  fr: {
    link: {
      label: "Lien",
      placeholder: "https://www.website.lu",
      "open-in-new-tab": "Ouvrir dans un nouvel onglet",
      save: "Enregistrer",
      cancel: "Annuler",
      unset: "Supprimer le lien",
      add: "Ajouter un lien",
      edit: "Modifier le lien",
    },
    format: "Format: {{format}}",
    paragraph: "Paragraphe",
    blockquote: "Citation",
    heading: "Titre",
    block: "Alignement",
    list: "Liste",
    "bullet-list": "Liste à puces",
    "ordered-list": "Liste numérotée",
    heading1: "Entête 1",
    heading2: "Entête 2",
    heading3: "Entête 3",
    heading4: "Entête 4",
    heading5: "Entête 5",
    heading6: "Entête 6",
    strikethrough: "Barrer",
    underline: "Souligner",
    bold: "Gras",
    italic: "Italique",
    undo: "Annuler",
    redo: "Répéter",
  },
  en: {
    link: {
      label: "Link",
      placeholder: "https://www.website.lu",
      "open-in-new-tab": "Open in new tab",
      save: "Save",
      cancel: "Cancel",
      unset: "Remove link",
      add: "Add link",
      edit: "Edit link",
    },
    format: "Format: {{format}}",
    paragraph: "Paragraph",
    blockquote: "Quote",
    heading: "Heading",
    block: "Align",
    list: "List",
    "bullet-list": "Bullet list",
    "ordered-list": "Ordered list",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    heading4: "Heading 4",
    strikethrough: "Strikethrough",
    underline: "Underline",
    bold: "Bold",
    italic: "Italic",
    undo: "Undo",
    redo: "Redo",
  },
  de: {
    link: {
      label: "Link",
      placeholder: "https://www.website.lu",
      "open-in-new-tab": "In neuem Tab öffnen",
      save: "Speichern",
      cancel: "Abbrechen",
      unset: "Link entfernen",
      add: "Link hinzufügen",
      edit: "Link bearbeiten",
    },
    format: "Format: {{format}}",
    paragraph: "Absatz",
    blockquote: "Zitat",
    heading: "Überschrift",
    block: "Ausrichtung",
    list: "Liste",
    "bullet-list": "Aufzählungsliste",
    "ordered-list": "Nummerierte Liste",
    heading1: "Überschrift 1",
    heading2: "Überschrift 2",
    heading3: "Überschrift 3",
    heading4: "Überschrift 4",
    heading5: "Überschrift 5",
    heading6: "Überschrift 6",
    strikethrough: "Durchgestrichen",
    underline: "Unterstrichen",
    bold: "Fett",
    italic: "Kursiv",
    undo: "Rückgängig",
    redo: "Wiederholen",
  },
}
