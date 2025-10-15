"use client"

import { Dashboard } from "@compo/dashboard"
import { useDropZone, useElementSize, useOnClickOutside, usePersistedState } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, placeholder } from "@compo/utils"
import { A, G } from "@mobily/ts-belt"
import { type Api } from "@services/dashboard"
import { Files, FolderPlus, Upload } from "lucide-react"
import React from "react"
import { mediasConfig } from "../../config"
import { MediasFolderProvider } from "../../folder.context.provider"
import { useBreadcrumbs } from "../../hooks/use-breadcrumbs"
import { useFiltered } from "../../hooks/use-filtered"
import { useUpload } from "../../hooks/use-upload"
import { useMedias } from "../../medias.context"
import { MediasProvider } from "../../medias.context.provider"
import { useSWRMedias } from "../../swr"
import { FilesType } from "../../types"
import { isMediaFile, typeToExtension } from "../../utils"
import { Cards } from "../cards"
import { Table } from "../table"

/**
 * SelectFiles
 */
export const SelectFilesDialog: React.FC<
  Ui.QuickDialogProps<true, true> & Omit<SelectFilesProps, "selectAndClose"> & { title?: string }
> = ({ title, open, onOpenChange, onCloseAutoFocus, close, mutate, item, multiple = false, type = "*", ...props }) => {
  const { _ } = useTranslation(dictionary)
  const titleSufix = multiple ? "multiple" : "single"
  return (
    <Ui.QuickDialog
      {...{ open, onOpenChange, onCloseAutoFocus, close, mutate, item }}
      title={placeholder(
        title,
        _("title.select", { type: _(`title.${type}-${titleSufix}`, { defaultValue: _(`title.file-${titleSufix}`) }) })
      )}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-20", close: "z-20" }}
      sticky
    >
      <SelectFiles {...props} multiple={multiple} type={type} onOpenChange={onOpenChange} />
    </Ui.QuickDialog>
  )
}

type SelectFilesProps = {
  multiple?: boolean
  hiddenIds?: string[]
  disabledIds?: string[]
  type?: FilesType
  persistedKey?: string
  files?: Api.MediaFileWithRelations[]
  rootId?: string | null
  onSelect: (files: Api.MediaFileWithRelations[]) => void
  onOpenChange: (open: boolean) => void
}
export const SelectFiles: React.FC<SelectFilesProps> = ({ rootId, ...props }) => {
  const defaultKey = React.useId()
  const persistedKey = props.persistedKey ?? defaultKey
  const [persistedRoot, setPersistedRoot] = usePersistedState(rootId ?? null, `media-${persistedKey}-root`)

  // state use to navigate in the folder tree
  const [currentFolder, setCurrentFolder_] = React.useState<string | null>(() => rootId ?? persistedRoot)
  const setCurrentFolder = (folder: string | null) => {
    setCurrentFolder_(folder)
    setPersistedRoot(folder)
  }
  const swr = useSWRMedias(currentFolder)

  return (
    <MediasFolderProvider controlled={{ folderId: currentFolder, setFolderId: setCurrentFolder }}>
      <MediasProvider multiple={props.multiple} swr={swr} canSelectFile>
        <Inner {...props} {...{ currentFolder, setCurrentFolder }} />
      </MediasProvider>
    </MediasFolderProvider>
  )
}

/**
 * Inner
 */

type InnerProps = Omit<SelectFilesProps, "rootId"> & {
  currentFolder: string | null
  setCurrentFolder: (id: string | null) => void
}

export const Inner: React.FC<InnerProps> = ({ currentFolder, setCurrentFolder, onOpenChange, onSelect, ...props }) => {
  const hiddenIds = React.useMemo(() => props.hiddenIds ?? [], [props.hiddenIds])
  const disabledIds = React.useMemo(() => props.disabledIds ?? [], [props.disabledIds])

  const { _ } = useTranslation(dictionary)

  const onQuickSelect = React.useCallback(
    (files: Api.MediaFileWithRelations[]) => {
      onSelect(files)
      onOpenChange(false)
    },
    [onSelect, onOpenChange]
  )

  // set key to set session storage
  const defaultKey = React.useId()
  const persistedKey = props.persistedKey ?? defaultKey

  // get context
  const { swr, createFolder: create, clear, uploadFiles, selected } = useMedias()

  const availableFiles = React.useMemo(() => {
    return G.isNullable(props.type) || props.type === "*"
      ? swr.files
      : A.filter(swr.files, ({ extension }) => typeToExtension(props.type).includes(extension))
  }, [swr.files, props.type])

  // prepare filtered folders and props for toolbar
  const { filteredFolders, filteredFiles, sortable, matchable, reset } = useFiltered({
    folders: swr.folders,
    files: availableFiles as Api.MediaFileWithRelations[],
    hiddenIds: hiddenIds,
    persistedKey: persistedKey,
  })

  // prepare breadcrumbs for navigation
  const breadcrumbs = useBreadcrumbs(currentFolder, setCurrentFolder)

  // drop zone for upload
  const { bindDropZone, dragOver } = useDropZone({
    onDropFiles: useUpload(),
    accept: mediasConfig.acceptedFileExtensions,
    max: mediasConfig.maxUploadFile,
  })

  const [view, viewProps] = Dashboard.Toolbar.useView(`medias-select`, "card")

  // Click outside to clear selection
  const containerRef = React.useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, clear)

  // Calculate toolbar height for padding
  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(toolbarRef)
  const total = swr.folders.length + swr.files.length
  const results = filteredFolders.length + filteredFiles.length

  const selectedFiles = React.useMemo(() => A.filter(selected, isMediaFile) as Api.MediaFileWithRelations[], [selected])

  const collectionProps = React.useMemo(
    () => ({
      files: filteredFiles,
      folders: filteredFolders,
      disabledIds,
      hiddenIds,
      selectOnClick: true,
      onQuickSelect,
    }),
    [filteredFiles, filteredFolders, disabledIds, hiddenIds, onQuickSelect]
  )
  return (
    <div className='group/dashboard @container/dashboard space-y-4' style={{ paddingTop: `${size[1]}px` }}>
      <div
        className='bg-card/90 absolute right-6 left-0 z-10 space-y-4 pl-6 backdrop-blur-[2px]'
        ref={toolbarRef}
        style={{ top: "calc(var(--dialog-header-height, 0px))" } as React.CSSProperties}
      >
        <Ui.Breadcrumbs {...breadcrumbs} />

        <Dashboard.Toolbar.Root size='sm' className='pb-4'>
          <Dashboard.Toolbar.Search {...matchable} placeholder={_("search-in-folder")} />
          <Dashboard.Toolbar.Aside className='justify-end'>
            <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
            <Dashboard.Toolbar.Button variant='secondary' icon onClick={() => create()}>
              <FolderPlus aria-hidden />
              <Ui.SrOnly>{_("create-folder")}</Ui.SrOnly>
            </Dashboard.Toolbar.Button>
            <Dashboard.Toolbar.Button onClick={() => uploadFiles()} size='sm'>
              <Upload aria-hidden />
              {_("upload-files")}
            </Dashboard.Toolbar.Button>
            <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
          </Dashboard.Toolbar.Aside>
        </Dashboard.Toolbar.Root>
      </div>

      <div {...bindDropZone} ref={containerRef}>
        <Dashboard.Collection view={view}>
          <Ui.AnimateHeight>
            <Dashboard.Empty
              t={_.prefixed("empty")}
              results={results}
              total={total}
              isLoading={swr.isLoading}
              reset={reset}
              create={uploadFiles}
            >
              {view === "card" ? (
                <Cards
                  className='grid grid-cols-1 gap-4 p-1 @sm/dashboard:grid-cols-2 @2xl/dashboard:grid-cols-3 @3xl/dashboard:grid-cols-4'
                  {...collectionProps}
                />
              ) : (
                <Table {...collectionProps} />
              )}
              {dragOver && (
                <div
                  className={cxm(
                    "absolute inset-0 z-30 size-full p-2 md:p-8",
                    "bg-background/80 animate-in fade-in-0 backdrop-blur-sm",
                    "border-accent-dark flex items-center justify-center border border-dashed"
                  )}
                >
                  <div className='text-muted-foreground flex flex-col items-center justify-center gap-3'>
                    <Files aria-hidden className='size-12 stroke-[1]' />
                    <h2 className='text-xl font-semibold'>{_("drop-zone.title")}</h2>
                    <p className='text-xs'>{_("drop-zone.description")}</p>
                  </div>
                </div>
              )}
            </Dashboard.Empty>
          </Ui.AnimateHeight>
          <Ui.QuickDialogStickyFooter className='z-20'>
            <Ui.Button onClick={() => onQuickSelect(selectedFiles)} disabled={A.isEmpty(selectedFiles)}>
              {_("select")}
            </Ui.Button>
            <Ui.Button variant='secondary' onClick={() => onOpenChange(false)}>
              {_("cancel")}
            </Ui.Button>
          </Ui.QuickDialogStickyFooter>
        </Dashboard.Collection>
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: {
      select: "Select {{type}}",
      "image-single": "an image",
      "image-multiple": "images",
      "video-single": "a video",
      "video-multiple": "videos",
      "audio-single": "an audio file",
      "audio-multiple": "audio files",
      "document-single": "a document",
      "document-multiple": "documents",
      "pdf-single": "a PDF",
      "pdf-multiple": "PDFs",
      "archive-single": "an archive",
      "archive-multiple": "archives",
      "file-single": "a file",
      "file-multiple": "files",
    },
    description: "Browse and select media files from your library",
    select: "Select",
    cancel: "Cancel",
    "upload-files": "Upload",
    "create-folder": "New folder",
    "search-in-folder": "Search files...",
    "drop-zone": {
      title: "Drop files here",
      description: "Release to upload files to this folder",
    },
    empty: {
      "no-item-title": "This folder is empty",
      "no-item-content-create": "{{create:Upload files}} to get started",
      "no-item-content": "No files or folders found here.",
      "no-result-title": "No matching files",
      "no-result-content": "Try adjusting your search or filters.",
      "no-result-content-reset": "No files match your criteria. {{reset:Clear filters}} to see all files.",
    },
    sort: {
      "name-asc": "Name (A-Z)",
      "name-desc": "Name (Z-A)",
      "createdAt-asc": "Oldest first",
      "createdAt-desc": "Newest first",
      "updatedAt-asc": "Least recently modified",
      "updatedAt-desc": "Most recently modified",
    },
  },
  fr: {
    title: {
      select: "Sélectionner {{type}}",
      "image-single": "une image",
      "image-multiple": "des images",
      "video-single": "une vidéo",
      "video-multiple": "des vidéos",
      "audio-single": "un fichier audio",
      "audio-multiple": "des fichiers audio",
      "document-single": "un document",
      "document-multiple": "des documents",
      "pdf-single": "un PDF",
      "pdf-multiple": "des PDFs",
      "archive-single": "une archive",
      "archive-multiple": "des archives",
      "file-single": "un fichier",
      "file-multiple": "des fichiers",
    },
    description: "Parcourez et sélectionnez des fichiers depuis votre bibliothèque",
    select: "Sélectionner",
    cancel: "Annuler",
    "upload-files": "Importer",
    "create-folder": "Nouveau dossier",
    "search-in-folder": "Rechercher des fichiers...",
    "drop-zone": {
      title: "Déposez vos fichiers ici",
      description: "Relâchez pour importer les fichiers dans ce dossier",
    },
    empty: {
      "no-item-title": "Ce dossier est vide",
      "no-item-content-create": "{{create:Importez des fichiers}} pour commencer",
      "no-item-content": "Aucun fichier ou dossier trouvé ici.",
      "no-result-title": "Aucun fichier correspondant",
      "no-result-content": "Essayez d'ajuster votre recherche ou vos filtres.",
      "no-result-content-reset":
        "Aucun fichier ne correspond à vos critères. {{reset:Effacer les filtres}} pour voir tous les fichiers.",
    },
    sort: {
      "name-asc": "Nom (A-Z)",
      "name-desc": "Nom (Z-A)",
      "createdAt-asc": "Plus anciens en premier",
      "createdAt-desc": "Plus récents en premier",
      "updatedAt-asc": "Moins récemment modifiés",
      "updatedAt-desc": "Plus récemment modifiés",
    },
  },
  de: {
    title: {
      select: "{{type}} auswählen",
      "image-single": "ein Bild",
      "image-multiple": "Bilder",
      "video-single": "ein Video",
      "video-multiple": "Videos",
      "audio-single": "eine Audiodatei",
      "audio-multiple": "Audiodateien",
      "document-single": "ein Dokument",
      "document-multiple": "Dokumente",
      "pdf-single": "ein PDF",
      "pdf-multiple": "PDFs",
      "archive-single": "ein Archiv",
      "archive-multiple": "Archive",
      "file-single": "eine Datei",
      "file-multiple": "Dateien",
    },
    description: "Durchsuchen und wählen Sie Mediendateien aus Ihrer Bibliothek aus",
    select: "Auswählen",
    cancel: "Abbrechen",
    "upload-files": "Hochladen",
    "create-folder": "Neuer Ordner",
    "search-in-folder": "Dateien suchen...",
    "drop-zone": {
      title: "Dateien hier ablegen",
      description: "Loslassen, um Dateien in diesen Ordner hochzuladen",
    },
    empty: {
      "no-item-title": "Dieser Ordner ist leer",
      "no-item-content-create": "{{create:Dateien hochladen}} um zu beginnen",
      "no-item-content": "Keine Dateien oder Ordner hier gefunden.",
      "no-result-title": "Keine passenden Dateien",
      "no-result-content": "Versuchen Sie, Ihre Suche oder Filter anzupassen.",
      "no-result-content-reset":
        "Keine Dateien entsprechen Ihren Kriterien. {{reset:Filter zurücksetzen}} um alle Dateien zu sehen.",
    },
    sort: {
      "name-asc": "Name (A-Z)",
      "name-desc": "Name (Z-A)",
      "createdAt-asc": "Älteste zuerst",
      "createdAt-desc": "Neueste zuerst",
      "updatedAt-asc": "Zuletzt geänderte zuletzt",
      "updatedAt-desc": "Zuletzt geänderte zuerst",
    },
  },
}
