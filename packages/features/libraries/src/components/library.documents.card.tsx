import { Dashboard } from "@compo/dashboard"
import { smartClick, useElementSize } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { PublicationCard, PublicationIcon } from "@compo/publications"
import { useContextualLanguage, useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, G, isNotEmptyString, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { FileText, Hash } from "lucide-react"
import React from "react"
import { useLibrary } from "../library.context"
import { useLibrariesService } from "../service.context"
import { LibraryDocumentsMenu } from "./library.documents.menu"
import { LibraryDocumentsPublication } from "./library.documents.publication"

/**
 * LibraryDocumentsCard
 */
export const LibraryDocumentsCard: React.FC<{ document: Api.LibraryDocument }> = ({ document }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const translatedDocument = translate(document, servicePlaceholder.libraryDocument)
  const title = placeholder(translatedDocument.title, _("title"))
  const description = placeholder(translatedDocument.description, _("description"))
  const { selectable } = useLibrary()
  const file = A.head(document.files)
  return (
    <LibraryDocumentsPublication document={document}>
      <Dashboard.Card.Root
        key={document.id}
        item={document}
        menu={<LibraryDocumentsMenu document={document} />}
        selectable={selectable}
        {...smartClick(document, selectable, () => {})}
      >
        <div className='relative w-full aspect-square'>
          <PreviewPdf files={document.files} />
          <PublicationIcon className='absolute right-1 top-1' />
        </div>
        <Dashboard.Card.Header className='grow'>
          <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
          <Dashboard.Card.Description className='line-clamp-4'>{description}</Dashboard.Card.Description>
        </Dashboard.Card.Header>
        <Dashboard.Card.Content className='justify-end'>
          {isNotEmptyString(document.reference) && (
            <Dashboard.Card.Field>
              <Hash aria-hidden />
              {document.reference}
            </Dashboard.Card.Field>
          )}
          <PublicationCard />
        </Dashboard.Card.Content>
      </Dashboard.Card.Root>
    </LibraryDocumentsPublication>
  )
}

const PreviewPdf: React.FC<{ files: Api.LibraryDocument["files"] }> = ({ files }) => {
  const firstFile = A.head(files)
  if (G.isNullable(firstFile))
    return (
      <Dashboard.Card.Image className='aspect-square w-full'>
        <FileText className='text-muted-foreground size-6' aria-hidden />
      </Dashboard.Card.Image>
    )

  if (files.length === 1)
    return (
      <div className='w-full aspect-square'>
        <SlidePdf file={firstFile} hideLabel />
      </div>
    )
  return (
    <Ui.Carousel.Root className='relative grid size-full isolate'>
      <Ui.Carousel.Content className='size-full aspect-square ml-0'>
        {A.map(files, (file) => (
          <Ui.Carousel.Item className='pl-0' key={file.id}>
            <SlidePdf file={file} />
          </Ui.Carousel.Item>
        ))}
      </Ui.Carousel.Content>
      {files.length > 1 && (
        <div className='absolute bottom-2 right-2 flex items-center gap-2'>
          <Ui.Carousel.Previous size='xxs' variant='secondary' />
          <Ui.Carousel.Next size='xxs' variant='secondary' />
        </div>
      )}
    </Ui.Carousel.Root>
  )
}

const SlidePdf: React.FC<{ file: Api.LibraryDocument["files"][number]; hideLabel?: boolean }> = ({
  file,
  hideLabel = false,
}) => {
  const { translate } = useLanguage()
  const { makePath } = useLibrariesService()

  // PDF preview refs - unique ref for each slide
  const pdfRef = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(pdfRef)

  const translated = translate(file, servicePlaceholder.mediaFile)

  const pdf = React.useMemo(
    () => (
      <Ui.PdfThumbnail
        data={{
          id: file.id,
          type: "pdf",
          src: makePath(file.url, true),
          downloadUrl: makePath(file.url, true),
          downloadFilename: translated.name,
        }}
        maxWidth={Math.min(size[0] || 150, 200)}
        maxHeight={Math.min(size[1] || 200, 267)}
      />
    ),
    [file.id, file.url, translated.name, size, makePath]
  )
  return (
    <div className='relative flex aspect-square size-full items-center justify-center'>
      {/* Background blur effect */}
      <div className='absolute inset-0 grid size-full overflow-hidden rounded-md opacity-25 blur-[2px]' aria-hidden>
        <div className='flex scale-[200%] items-center justify-center'>{pdf}</div>
      </div>

      {/* Fallback when no preview */}
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
        <FileText className='text-muted-foreground/50 size-16' aria-hidden />
      </div>

      {/* Main PDF preview */}
      <div
        ref={pdfRef}
        className='relative flex size-full max-h-full max-w-full items-center justify-center overflow-hidden p-4'
      >
        <div className='flex max-h-full max-w-full items-center justify-center'>{pdf}</div>
      </div>
      {!hideLabel && isNotEmptyString(file.code) && (
        <Ui.Badge variant='default' className='absolute bottom-2 left-2 max-w-[75%]'>
          {file.code}
        </Ui.Badge>
      )}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Untitled",
    description: "No description",
  },
  fr: {
    title: "Sans titre",
    description: "Sans description",
  },
  de: {
    title: "Ohne Titel",
    description: "Keine Beschreibung",
  },
}
