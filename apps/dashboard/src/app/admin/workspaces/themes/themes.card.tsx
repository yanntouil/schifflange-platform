import { Api, service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import { SwatchBook } from "lucide-react"
import React from "react"
import { useThemes } from "./context"
import { ThemeMenu } from "./themes.menu"

/**
 * ThemesCards
 * display a list of themes as cards with a menu and a checkbox (grid list)
 */
export const ThemesCards: React.FC<{ themes: Api.Admin.WorkspaceTheme[] }> = ({ themes }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(themes, (theme) => (
        <ThemeCard key={theme.id} theme={theme} />
      ))}
    </section>
  )
}

/**
 * ThemeCard
 * display a theme as a card
 */
const ThemeCard: React.FC<{ theme: Api.Admin.WorkspaceTheme }> = ({ theme }) => {
  const { _ } = useTranslation(dictionary)
  const { selectable, edit } = useThemes()
  const image = service.getImageUrl(theme.image) as string

  return (
    <Dashboard.Card.Root
      key={theme.id}
      menu={<ThemeMenu theme={theme} />}
      item={theme}
      selectable={selectable}
      {...smartClick(theme, selectable, () => edit(theme))}
    >
      <div className="relative">
        <Dashboard.Card.Image src={image} alt={theme.name}>
          <SwatchBook aria-hidden />
        </Dashboard.Card.Image>
        {theme.isDefault && <Ui.Badge className="absolute right-2 bottom-2">{_("default")}</Ui.Badge>}
      </div>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{theme.name}</Dashboard.Card.Title>
        {theme.description && <Dashboard.Card.Description>{theme.description}</Dashboard.Card.Description>}
      </Dashboard.Card.Header>
      <Dashboard.Card.Content></Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    default: "Default",
  },
  fr: {
    default: "Défaut",
  },
  de: {
    default: "Standard",
  },
}
