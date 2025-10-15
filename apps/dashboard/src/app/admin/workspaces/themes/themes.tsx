import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, flow } from "@compo/utils"
import { Plus } from "lucide-react"
import React from "react"
import { useThemes } from "./context"
import { themesStore, useThemesStore } from "./store"
import { ThemesCards } from "./themes.card"
import { ThemesTable } from "./themes.table"
import { ThemesToolbar } from "./toolbar"

const { setPage, setLimit } = themesStore.actions
const { resetFilterBy, setSearch } = themesStore.actions

/**
 * Themes
 */
export const Themes: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const view = useThemesStore(D.prop("view"))
  const page = useThemesStore(flow(D.prop("query"), D.prop("page")))
  const limit = useThemesStore(flow(D.prop("query"), D.prop("limit")))
  const { create, themes, metadata, swr, selected, clear, deleteSelection } = useThemes()

  return (
    <Dashboard.Container>
      <Dashboard.Header className="flex justify-between gap-8">
        <div>
          <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
          <Dashboard.Description>{_("description")}</Dashboard.Description>
        </div>
        <Ui.Button onClick={create} size="lg">
          <Plus aria-hidden />
          {_("create")}
        </Ui.Button>
      </Dashboard.Header>
      <ThemesToolbar />
      <Dashboard.Collection view={view} onPointerDownOutside={clear}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={deleteSelection} />
        <Dashboard.Empty
          total={themes.length}
          results={metadata.total}
          t={_.prefixed("empty")}
          create={create}
          reset={() => {
            resetFilterBy()
            setSearch("")
          }}
          isLoading={swr.isLoading}
        >
          {view === "row" ? <ThemesTable themes={themes} /> : <ThemesCards themes={themes} />}
        </Dashboard.Empty>
        <Dashboard.Pagination {...{ page, setPage, limit, setLimit, total: metadata.total }} />
      </Dashboard.Collection>
    </Dashboard.Container>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Workspace Themes",
    description: "Manage custom themes for workspaces with personalized styling and branding.",
    create: "Add a new theme",
    empty: {
      "no-item-title": "No theme found",
      "no-item-content-create": "Create a theme by {{create:clicking here}}",
      "no-result-title": "No result found",
      "no-result-content-reset": "We have not found any item corresponding to your search, try to {{reset:reset all filters}}",
    },
  },
  fr: {
    title: "Thèmes d'espaces de travail",
    description: "Gérez les thèmes personnalisés pour les espaces de travail avec un style et une image de marque personnalisés.",
    create: "Ajouter un nouveau thème",
    empty: {
      "no-item-title": "Aucun thème trouvé",
      "no-item-content-create": "Créez un thème pour commencer {{create:en cliquant ici}}",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
  },
  de: {
    title: "Arbeitsbereich-Themen",
    description: "Verwalten Sie benutzerdefinierte Themen für Arbeitsbereiche mit personalisiertem Styling und Branding.",
    create: "Neues Thema hinzufügen",
    empty: {
      "no-item-title": "Kein Thema gefunden",
      "no-item-content-create": "Erstellen Sie ein Thema, indem Sie {{create:hier klicken}}",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content-reset":
        "Wir haben kein Element gefunden, das Ihrer Suche entspricht, versuchen Sie {{reset:alle Filter zurückzusetzen}}",
    },
  },
}
