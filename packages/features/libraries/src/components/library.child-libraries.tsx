import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Notebook, Plus } from "lucide-react"
import React from "react"
import { useLibraries } from "../libraries.context"
import { useLibrary } from "../library.context"
import { Libraries } from "./libraries"

/**
 * LibraryChildLibraries
 * Component that displays child libraries using the Libraries component
 */
export const LibraryChildLibraries: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createLibrary } = useLibraries()
  const ctx = useLibrary()
  const { library } = ctx.swr
  const baseLevel = 2
  const total = library.childLibraries.length

  return (
    <Ui.CollapsibleCard.Root id={`${library.id}-child-libraries`} defaultOpen={false}>
      <Ui.CollapsibleCard.Header>
        <div>
          <Ui.CollapsibleCard.Title level={baseLevel}>
            {_("title")}
            <span className='text-muted-foreground text-xs inline-flex items-center gap-1'>
              {total}
              <Notebook className='size-3.5' aria-hidden />
            </span>
          </Ui.CollapsibleCard.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.CollapsibleCard.Aside>
          <Ui.Button variant='ghost' size='xs' onClick={() => createLibrary()}>
            <Plus aria-hidden />
            {_("create")}
          </Ui.Button>
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container'>
        <div className='p-6 pt-2 flex flex-col gap-6'>
          <Libraries />
        </div>
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Child libraries",
    description: "Manage libraries contained within this library (hierarchical tree structure)",
    create: "Add child library",
  },
  fr: {
    title: "Bibliothèques enfants",
    description: "Gérer les bibliothèques contenues dans cette bibliothèque (structure hiérarchique en arbre)",
    create: "Ajouter une bibliothèque enfant",
  },
  de: {
    title: "Unterbibliotheken",
    description: "Bibliotheken verwalten, die in dieser Bibliothek enthalten sind (hierarchische Baumstruktur)",
    create: "Unterbibliothek hinzufügen",
  },
}
