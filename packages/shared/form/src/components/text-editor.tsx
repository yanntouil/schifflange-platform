import { useTranslation, type Translation } from "@compo/localize"
import React from "react"
import RichTextEditor from "reactjs-tiptap-editor"
import {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color,
  Emoji,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  Indent,
  Italic,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TableOfContents,
  TaskList,
  TextAlign,
  Underline,
} from "reactjs-tiptap-editor/extension-bundle" // for version 0.1.16 and lower
import "reactjs-tiptap-editor/style.css"
import { useField } from "use-a11y-form"
import { extractGroupProps, extractInputProps, FormGroup, FormGroupProps } from "."
import { useTiptapLocale } from "./text-editor.locale"

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
type FieldTextEditorProps = {
  placeholder?: string
  lang?: string
  prose?: string
  inline?: boolean
  disabled?: boolean
}
export const FieldTextEditor: React.FC<FieldTextEditorProps> = ({ ...props }) => {
  const field = useField<string>()
  const disabled = field.disabled || props.disabled
  return (
    <TextEditor
      value={field.value}
      id={field.id}
      key={field.id}
      onValueChange={field.onChange}
      disabled={disabled}
      {...props}
    />
  )
}

/**
 * Text editor
 */
type TextEditorProps = {
  value: string
  onValueChange: (value: string) => void
  id: string
  prose?: string
  lang?: string
  disabled?: boolean
  // inline?: boolean
}
const TextEditor: React.FC<TextEditorProps> = ({ value, onValueChange, id, lang, prose /*inline = false*/ }) => {
  useTiptapLocale()
  const inlineExtensions = useInlineExtensions()
  const blockExtensions = useBlockExtensions()
  const inline = false
  const { _ } = useTranslation(dictionary)

  // Extension to prevent hard breaks in inline mode
  // const PreventHardBreak = Extension.create({
  //   name: "preventHardBreak",
  //   addKeyboardShortcuts() {
  //     return {
  //       Enter: () => true, // Prevent Enter key
  //       "Shift-Enter": () => true, // Prevent Shift+Enter
  //     }
  //   },
  // })

  const extensions = [
    BaseKit.configure({
      // Show placeholder
      placeholder: {
        placeholder: _("placeholder"),
        showOnlyCurrent: true,
      },
      characterCount: false,
      // dropcursor: inline ? false : undefined,
      dropcursor: undefined,
      gapcursor: false,
      multiColumn: true,
    }),
    ...inlineExtensions,
    ...(inline ? [] : blockExtensions),
    // ...(inline ? [PreventHardBreak] : []),
    SearchAndReplace.configure({}),
    SlashCommand,
    // Clear,
    // FormatPainter.configure({}),
    History,
  ]
  return (
    <div className={inline ? "[&_.ProseMirror]:inline" : undefined}>
      <RichTextEditor
        output='html'
        content={value}
        onChangeContent={onValueChange}
        extensions={extensions}
        dense={false}
        contentClass={prose}
        hideToolbar={inline}
        bubbleMenu={
          {
            // textConfig: {
            //   hidden: true,
            // },
          }
        }
      />
    </div>
  )
}

const useInlineExtensions = () => {
  return React.useMemo(
    () => [
      Bold.configure({}),
      Italic.configure({}),
      Strike.configure({}),
      Underline.configure({}),
      MoreMark.configure({}),
      Color.configure({
        toolbar: false,
      }),
      Highlight.configure({
        toolbar: false,
      }),
      Code.configure({
        toolbar: false,
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
          // Allow empty URLs during editing
          if (!url || url.trim() === "") {
            return true
          }

          try {
            // Allow tel: and mailto: protocols
            if (url.startsWith("tel:") || url.startsWith("mailto:")) {
              return true
            }

            // Construct URL
            const parsedUrl = new URL(url.includes("://") ? url : `${ctx.defaultProtocol}://${url}`)

            // Disallowed protocols
            const disallowedProtocols = ["ftp", "file", "javascript"]
            const protocol = parsedUrl.protocol.replace(":", "")

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // Only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // Disallowed domains (anti-phishing)
            const domain = parsedUrl.hostname
            if (disallowedDomains.includes(domain)) {
              return false
            }

            // All checks passed
            return true
          } catch (error) {
            // If URL parsing fails, allow it during editing (will be validated on save)
            return true
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
    ],
    []
  )
}
const useBlockExtensions = () => {
  return React.useMemo(
    () => [
      Heading.configure({}),
      Indent.configure({
        toolbar: false,
      }),
      Blockquote.configure({}),
      BulletList.configure({}),
      OrderedList.configure({}),
      Table.configure({}),
      TaskList.configure({}),
      TextAlign.configure({
        toolbar: false,
      }),
      HorizontalRule.configure({}),
      Iframe.configure({
        toolbar: false,
      }),
      CodeBlock.configure({
        toolbar: false,
      }),
    ],
    []
  )
}
const unusedExtensions = () => {
  const extensions = [FontSize, LineHeight, FontFamily, FormatPainter, Image, Emoji, TableOfContents]
}

/**
 * translations
 */
const dictionary = {
  en: {
    placeholder: "Write something...",
  },
  fr: {
    placeholder: "Écrivez quelque chose...",
  },
  de: {
    placeholder: "Schreiben Sie etwas...",
  },
} satisfies Translation
