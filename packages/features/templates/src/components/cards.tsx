import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { Card } from "./card"

/**
 * Cards
 */
export const Cards: React.FC<{ templates: Api.TemplateWithRelations[] }> = ({ templates }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(templates, (template) => (
        <Card key={template.id} template={template} />
      ))}
    </section>
  )
}
