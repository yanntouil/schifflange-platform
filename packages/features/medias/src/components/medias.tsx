import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import { FolderPlus, Folders, Upload } from "lucide-react"
import React from "react"
import { useFiltered } from "../hooks/use-filtered"
import { useMedias } from "../medias.context"
import { Cards, CardsSkeleton } from "./cards"
import { Table, TableSkeleton } from "./table"

/**
 * Medias
 * This component is used to manage and navigate between the medias list and folders
 */
export const Medias: React.FC = () => {
  const { swr, createFolder, uploadFiles, clear, selected, confirmDeleteSelection, moveSelection } = useMedias()
  const { _ } = useTranslation(dictionary)
  const { reset, matchable, filteredFiles, filteredFolders, sortable } = useFiltered({
    folders: swr.folders,
    files: swr.files,
    persistedKey: `dashboard-${swr.folderId || "root"}`,
  })
  const [view, viewProps] = Dashboard.Toolbar.useView(`medias-manager`, "row")
  const total = swr.folders.length + swr.files.length
  const [pagination, [paginatedFolders, paginatedFiles]] = Ui.useMergePagination(total, 1, 25, [
    filteredFolders,
    filteredFiles,
  ] as const)
  const results = paginatedFolders.length + paginatedFiles.length
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <Dashboard.Toolbar.Button onClick={() => createFolder()} tooltip={_("create-folder-tooltip")}>
            <FolderPlus aria-hidden />
            {_("create-folder")}
          </Dashboard.Toolbar.Button>
          <Dashboard.Toolbar.Button onClick={() => uploadFiles()} tooltip={_("upload-files-tooltip")}>
            <Upload aria-hidden />
            {_("upload-files")}
          </Dashboard.Toolbar.Button>
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>
      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar
          selected={selected}
          unselect={clear}
          delete={confirmDeleteSelection}
          actions={[{ icon: <Folders aria-hidden />, label: _("move"), handler: () => moveSelection() }]}
        />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createFolder}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <Cards files={paginatedFiles} folders={paginatedFolders} />
          ) : (
            <Table files={paginatedFiles} folders={paginatedFolders} />
          )}
        </Dashboard.Empty>
        {swr.isLoading && (view === "card" ? <CardsSkeleton count={3} /> : <TableSkeleton count={3} />)}
        {results > 0 && (
          <div className={cxm("mt-4 flex flex-col items-center justify-between gap-x-6 pt-4 @2xl/collection:flex-row")}>
            <p className='text-muted-foreground inline-flex h-9 shrink-0 items-center text-xs/relaxed'>
              {_("total", { from: pagination.from, to: pagination.to, total })}
            </p>
            <Ui.Pagination.Quick {...pagination} className={cxm("@2xl/collection:justify-end")} size='sm' />
          </div>
        )}
      </Dashboard.Collection>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    search: "Search in medias and folders",
    "create-folder": "Folder",
    "create-folder-tooltip": "Add a new folder here",
    "upload-files": "Files",
    "upload-files-tooltip": "Upload some files here",
    move: "Move",
    total: "Results {{from}} to {{to}} of {{total}}",
    sort: {
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "Folder is empty",
      "no-item-content-create": "Start by uploading a file {{create:by clicking here}} or drop directly a file here",
      "no-item-content": "There is no item here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any item corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any item corresponding to your search, try to {{reset:reset all filters}}",
    },
  },
  fr: {
    search: "Rechercher dans les médias et les dossiers",
    "create-folder": "Dossier",
    "create-folder-tooltip": "Ajouter un nouveau dossier ici",
    "upload-files": "Fichiers",
    "upload-files-tooltip": "Téléverser des fichiers ici",
    move: "Déplacer",
    total: "Résultats {{from}} à {{to}} sur {{total}}",
    sort: {
      "name-asc": "Nom (a → z)",
      "name-desc": "Nom (z → a)",
      "createdAt-asc": "Date de création (du plus ancien au plus récent)",
      "createdAt-desc": "Date de création (du plus récent au plus ancien)",
      "updatedAt-asc": "Date de modification (du plus ancien au plus récent)",
      "updatedAt-desc": "Date de modification (du plus récent au plus ancien)",
    },
    empty: {
      "no-item-title": "Le dossier est vide",
      "no-item-content-create":
        "Commencez par téléverser un fichier {{create:en cliquant ici}} ou en glissez-déposez un fichier ici",
      "no-item-content": "Il n'y a pas d'élément ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé d'élément correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
  },
  de: {
    search: "In Medien und Ordnern suchen",
    "create-folder": "Ordner",
    "create-folder-tooltip": "Hier einen neuen Ordner hinzufügen",
    "upload-files": "Dateien",
    "upload-files-tooltip": "Hier einige Dateien hochladen",
    move: "Verschieben",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Ordner ist leer",
      "no-item-content-create":
        "Beginnen Sie mit dem Hochladen einer Datei {{create:durch Klicken hier}} oder ziehen Sie eine Datei hierher",
      "no-item-content": "Es befinden sich momentan keine Elemente hier.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten kein Element zu Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten kein Element zu Ihrer Suche finden, versuchen Sie {{reset:alle Filter zurückzusetzen}}",
    },
  },
}
