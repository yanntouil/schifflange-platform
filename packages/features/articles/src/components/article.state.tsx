import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { useArticle } from "../article.context"
import { ArticlesStateIcon } from "./icons"

/**
 * StateButton
 * display state of page as a button to toggle state
 */
export const StateButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, toggleState } = useArticle()
  const isPublished = swr.article.state === "published"
  return (
    <Ui.Tooltip.Quick tooltip={isPublished ? _("state-published") : _("state-draft")} side='left' asChild>
      <Ui.Button variant='ghost' icon size='xs' onClick={() => toggleState()}>
        <ArticlesStateIcon state={swr.article.state} />
        <Ui.SrOnly>{isPublished ? _("state-published") : _("state-draft")}</Ui.SrOnly>
      </Ui.Button>
    </Ui.Tooltip.Quick>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "state-draft": "Brouillon (cliquer pour publier)",
    "state-published": "Publié (cliquer pour mettre en brouillon)",
  },
  en: {
    "state-draft": "Draft (click to publish)",
    "state-published": "Published (click to draft)",
  },
  de: {
    "state-draft": "Entwurf (klicken zum Veröffentlichen)",
    "state-published": "Veröffentlicht (klicken für Entwurf)",
  },
}
