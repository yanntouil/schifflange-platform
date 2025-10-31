import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match, placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync, FileTextIcon, GlobeIcon, LayoutPanelTop, LockIcon } from "lucide-react"
import React from "react"
import { usePages } from "../pages.context"
import { usePagesService } from "../service.context"
import { PagesMenu } from "./pages.menu"

/**
 * PagesCard
 */
export const PagesCard: React.FC<{ page: Api.PageWithRelations }> = ({ page }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { getImageUrl } = usePagesService()
  const { translate } = useLanguage()
  const translatedSeo = translate(page.seo, servicePlaceholder.seo)
  const { selectable, displayPage } = usePages()
  const title = placeholder(translatedSeo.title, _("untitled"))
  const description = placeholder(translatedSeo.description, _("no-description"))
  const imageUrl = getImageUrl(translatedSeo.image)

  return (
    <Dashboard.Card.Root
      key={page.id}
      menu={<PagesMenu page={page} />}
      item={page}
      selectable={selectable}
      {...smartClick(page, selectable, () => displayPage(page))}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined}>
        <LayoutPanelTop className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      {page.lock && (
        <Ui.Tooltip.Quick tooltip={_("locked")} asChild>
          <Ui.Button className='absolute top-2 right-2' icon variant='overlay' size='xs'>
            <LockIcon aria-hidden />
          </Ui.Button>
        </Ui.Tooltip.Quick>
      )}
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          {match(page.state)
            .with("published", () => <GlobeIcon aria-hidden className='text-green-600' />)
            .with("draft", () => <FileTextIcon aria-hidden className='text-orange-600' />)
            .exhaustive()}
          {_(`state-${page.state}`)}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field tooltip={_("updated-at-tooltip", { date: format(T.parseISO(page.updatedAt), "PPPp") })}>
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(page.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    locked: "This page is locked, ask an administrator to unlock it",
    untitled: "Untitled page",
    "no-description": "No description",
    "state-draft": "Draft",
    "state-published": "Published",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    locked: "Cette page est verrouillée, demander à un administrateur pour la déverrouiller",
    untitled: "Page sans titre",
    "no-description": "Aucune description",
    "state-draft": "Brouillon",
    "state-published": "Publié",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    locked: "Diese Seite ist gesperrt, bitten Sie einen Administrator, sie zu entsperren",
    untitled: "Unbenannte Seite",
    "no-description": "Keine Beschreibung",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
