import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { FileText, Folders } from "lucide-react"
import React from "react"
import { useLibraries } from "../libraries.context"
import { LibrariesMenu } from "./libraries.menu"

/**
 * LibrariesCard
 */
export const LibrariesCard: React.FC<{ library: Api.Library }> = ({ library }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const translatedLibrary = translate(library, servicePlaceholder.library)
  const title = placeholder(translatedLibrary.title, _("title"))
  const description = placeholder(translatedLibrary.description, _("description"))
  const { selectable, displayLibrary } = useLibraries()

  const childCount = library.childLibraries?.length ?? 0
  const documentsCount = library.documents?.length ?? 0

  return (
    <Dashboard.Card.Root
      key={library.id}
      menu={<LibrariesMenu library={library} />}
      item={library}
      selectable={selectable}
      {...smartClick(library, selectable, () => displayLibrary(library))}
    >
      <Dashboard.Card.Image>
        <Ui.ImageEmpty className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header className='grow'>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description className='line-clamp-4'>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content className='justify-end'>
        {childCount > 0 && (
          <Dashboard.Card.Field>
            <Folders aria-hidden />
            {_("child-libraries-label", { count: childCount })}
          </Dashboard.Card.Field>
        )}
        {documentsCount > 0 && (
          <Dashboard.Card.Field>
            <FileText aria-hidden />
            {_("documents-label", { count: documentsCount })}
          </Dashboard.Card.Field>
        )}
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Title",
    description: "Description",
    "child-libraries-label": "{{count}} sub-libraries",
    "documents-label": "{{count}} documents",
  },
  fr: {
    title: "Titre",
    description: "Description",
    "child-libraries-label": "{{count}} sous-bibliothèques",
    "documents-label": "{{count}} documents",
  },
  de: {
    title: "Titel",
    description: "Beschreibung",
    "child-libraries-label": "{{count}} Unterbibliotheken",
    "documents-label": "{{count}} Dokumente",
  },
}
