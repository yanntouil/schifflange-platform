import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Building2, Plus } from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"
import { useOrganisations } from "../organisations.context"
import { Organisations } from "./organisations"

/**
 * OrganisationChildOrganisations
 */
export const OrganisationChildOrganisations: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createOrganisation } = useOrganisations()
  const ctx = useOrganisation()
  const { organisation } = ctx.swr
  const baseLevel = 2
  const total = organisation.childOrganisations.length
  return (
    <Ui.CollapsibleCard.Root id={`${organisation.id}-child-organisations`} defaultOpen={false}>
      <Ui.CollapsibleCard.Header>
        <div>
          <Ui.CollapsibleCard.Title level={baseLevel}>
            {_("title")}
            <span className='text-muted-foreground text-xs inline-flex items-center gap-1'>
              {total}
              <Building2 className='size-3.5' aria-hidden />
            </span>
          </Ui.CollapsibleCard.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.CollapsibleCard.Aside>
          <Ui.Button variant='ghost' size='xs' onClick={() => createOrganisation()}>
            <Plus aria-hidden />
            {_("create")}
          </Ui.Button>
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container'>
        <div className='p-6 pt-2 flex flex-col gap-6'>
          <Organisations />
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
    title: "Child organisations",
    description: "Manage organisations contained within this organisation (hierarchical tree structure)",
    create: "Add child organisation",
  },
  fr: {
    title: "Organisations enfants",
    description: "Gérer les organisations contenues dans cette organisation (structure hiérarchique en arbre)",
    create: "Ajouter une organisation enfant",
  },
  de: {
    title: "Unterorganisationen",
    description: "Organisationen verwalten, die in dieser Organisation enthalten sind (hierarchische Baumstruktur)",
    create: "Unterorganisation hinzufügen",
  },
}
