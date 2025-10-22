import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import { useOrganisations } from "../organisations.context"

/**
 * OrganisationsHeader
 */
export const OrganisationsHeader: React.FC<{ hideCreate?: boolean }> = ({ hideCreate = false }) => {
  const { _ } = useTranslation(dictionary)
  const { createOrganisation } = useOrganisations()
  return (
    <Dashboard.Header className='flex justify-between gap-8'>
      <div className='space-y-1.5'>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant='outline' icon size='lg' onClick={() => createOrganisation()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create-organisation")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Organizations",
    description: "Manage all organizations",
    "create-organisation": "Create organisation",
  },
  fr: {
    title: "Organisations",
    description: "Gérer toutes les organisations",
    "create-organisation": "Créer une organisation",
  },
  de: {
    title: "Organisationen",
    description: "Alle Organisationen verwalten",
    "create-organisation": "Organisation erstellen",
  },
}
