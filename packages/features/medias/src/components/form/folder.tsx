import { Dashboard } from "@compo/dashboard"
import {
  extractGroupProps,
  extractInputProps,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "@compo/form"
import { useElementSize, useOnClickOutside, usePersistedState } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, cxm, z } from "@compo/utils"
import { FolderPlus } from "lucide-react"
import React from "react"
import { useMediasFolder } from "../../folder.context"
import { MediasFolderProvider } from "../../folder.context.provider"
import { useBreadcrumbs } from "../../hooks/use-breadcrumbs"
import { useFiltered } from "../../hooks/use-filtered"
import { useMedias } from "../../medias.context"
import { MediasProvider } from "../../medias.context.provider"
import { useSWRMedias } from "../../swr"
import { isMediaFolder } from "../../utils"
import { Cards } from "../cards"
import { Table } from "../table"

/**
 * FormCropper
 */
export type FormMediaFolderProps = FieldMediaFolderProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormMediaFolder: React.FC<FormMediaFolderProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldMediaFolder {...extractInputProps({ ...props })} className={classNames?.input} />
    </FormGroup>
  )
}

/**
 * FieldFolder
 */
type FieldMediaFolderProps = {
  persistedKey?: string
  rootId?: string | null
  disabledIds?: string[]
  hiddenIds?: string[]
  className?: string
}
const FieldMediaFolder: React.FC<FieldMediaFolderProps> = ({
  rootId = null,
  disabledIds,
  hiddenIds,
  className,
  ...props
}) => {
  // set key to set session storage
  const defaultKey = React.useId()
  const persistedKey = `form-folder-${props.persistedKey ?? defaultKey}`

  const [folderId, setFolderId] = usePersistedState<string | null>(rootId, persistedKey, z.string().nullable())
  const swr = useSWRMedias(folderId)

  return (
    <MediasFolderProvider controlled={{ folderId, setFolderId }}>
      <MediasProvider swr={swr} canSelectFolder>
        <Inner {...{ persistedKey, disabledIds, hiddenIds, className }} />
      </MediasProvider>
    </MediasFolderProvider>
  )
}

type InnerProps = {
  persistedKey: string
  disabledIds?: string[]
  hiddenIds?: string[]
  className?: string
}
const Inner: React.FC<InnerProps> = ({ hiddenIds, disabledIds, persistedKey, className }) => {
  const { _ } = useTranslation(dictionary)
  // get context
  const { swr, createFolder: create, clear, selected } = useMedias()
  const { folders } = swr
  const { value, setFieldValue } = useFieldContext<string | null>()
  const { folderId, setFolderId } = useMediasFolder()

  // set value when selection change
  React.useLayoutEffect(() => {
    const item = A.head(selected)
    if (item && isMediaFolder(item) && item.id !== value) {
      setFieldValue(item.id)
    }
    if (A.isEmpty(selected) && folderId !== value) {
      setFieldValue(folderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // set value when navigation change
  React.useLayoutEffect(() => {
    if (folderId !== value) {
      setFieldValue(folderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId])

  // prepare filtered folders and props for toolbar
  const { filteredFolders, sortable, matchable, reset } = useFiltered({
    folders,
    files: [], // display only in the folder
    hiddenIds,
    persistedKey,
  })

  // prepare breadcrumbs for navigation
  const breadcrumbs = useBreadcrumbs(folderId, setFolderId)

  const containerRef = React.useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, clear)
  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(toolbarRef)
  const [view, viewProps] = Dashboard.Toolbar.useView(`medias-form-folder`, "card")
  const total = swr.folders.length
  const results = filteredFolders.length
  return (
    <div
      className={cxm("group/dashboard @container/dashboard space-y-4", className)}
      style={{ paddingTop: `${size[1]}px` }}
    >
      <div
        className='bg-card/80 absolute right-6 left-0 z-10 space-y-4 pl-6 backdrop-blur-[2px]'
        ref={toolbarRef}
        style={{ top: "calc(var(--dialog-header-height))" } as React.CSSProperties}
      >
        <Ui.Breadcrumbs {...breadcrumbs} />

        <Dashboard.Toolbar.Root size='sm' className='pb-4'>
          <Dashboard.Toolbar.Search {...matchable} placeholder={_("search-in-folder")} />
          <Dashboard.Toolbar.Aside className='justify-end'>
            <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
            <Dashboard.Toolbar.Button variant='secondary' onClick={() => create()}>
              <FolderPlus aria-hidden />
              {_("create-folder")}
            </Dashboard.Toolbar.Button>
            <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
          </Dashboard.Toolbar.Aside>
        </Dashboard.Toolbar.Root>
      </div>

      <Dashboard.Collection>
        <Ui.AnimateHeight>
          <Dashboard.Empty
            t={_.prefixed("empty")}
            results={results}
            total={total}
            isLoading={swr.isLoading}
            create={async () => create()}
            reset={reset}
          >
            <div ref={containerRef}>
              {view === "card" ? (
                <Cards
                  className='grid grid-cols-1 gap-4 p-1 @sm/dashboard:grid-cols-2 @2xl/dashboard:grid-cols-3 @3xl/dashboard:grid-cols-4'
                  files={[]}
                  folders={filteredFolders}
                  disabledIds={disabledIds}
                  hiddenIds={hiddenIds}
                />
              ) : (
                <Table files={[]} folders={filteredFolders} disabledIds={disabledIds} hiddenIds={hiddenIds} />
              )}
            </div>
          </Dashboard.Empty>
        </Ui.AnimateHeight>
      </Dashboard.Collection>
    </div>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "search-in-folder": "Search in folder",
    "create-folder": "Create folder",
    empty: {
      "no-item-title": "The folder is empty",
      "no-item-content-create": "Create a folder to start {{create:by clicking here}}",
      "no-item-content": "There are no items here for the moment.",
      "no-result-title": "No result found",
      "no-result-content": "We didn't find any item corresponding to your search.",
      "no-result-content-reset":
        "We didn't find any item corresponding to your search, try to {{reset:reset all filters}}",
    },
    sort: {
      "name-asc": "Name (A-Z)",
      "name-desc": "Name (Z-A)",
      "createdAt-asc": "Created (oldest first)",
      "createdAt-desc": "Created (recents first)",
      "updatedAt-asc": "Updated (oldest first)",
      "updatedAt-desc": "Updated (recents first)",
    },
  },
  fr: {
    "search-in-folder": "Rechercher dans le dossier",
    "create-folder": "Créer un dossier",
    empty: {
      "no-item-title": "Le dossier est vide",
      "no-item-content-create": "Créer un dossier pour commencer {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de dossier ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons trouvé aucun item correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun item correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
    sort: {
      "name-asc": "Nom (A-Z)",
      "name-desc": "Nom (Z-A)",
      "createdAt-asc": "Créé (du plus ancien au plus récent)",
      "createdAt-desc": "Créé (du plus récent au plus ancien)",
      "updatedAt-asc": "Modifié (du plus ancien au plus récent)",
      "updatedAt-desc": "Modifié (du plus récent au plus ancien)",
    },
  },
  de: {
    "search-in-folder": "Im Ordner suchen",
    "create-folder": "Ordner erstellen",
    empty: {
      "no-item-title": "Der Ordner ist leer",
      "no-item-content-create": "Ordner erstellen, um zu beginnen {{create:durch Klicken hier}}",
      "no-item-content": "Es befinden sich momentan keine Ordner hier.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten kein Element zu Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten kein Element zu Ihrer Suche finden, versuchen Sie {{reset:alle Filter zurückzusetzen}}",
    },
    sort: {
      "name-asc": "Name (A-Z)",
      "name-desc": "Name (Z-A)",
      "createdAt-asc": "Erstellt (älteste zuerst)",
      "createdAt-desc": "Erstellt (neueste zuerst)",
      "updatedAt-asc": "Geändert (älteste zuerst)",
      "updatedAt-desc": "Geändert (neueste zuerst)",
    },
  },
}
