import { makeDictionary, useTranslation } from "@compo/localize"
import { Thumbnail, useSwrTemplates } from "@compo/templates"
import { useLanguage, useLanguages } from "@compo/translations"
import { Primitives, Ui, variants } from "@compo/ui"
import { A, cxm, D, match, placeholder } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Info, Search } from "lucide-react"
import React from "react"
import { useContent } from "../../context"
import { ExportedItem, ItemSync } from "../../types.sync"
import { createPayload } from "../../utils"
import { flattenClientItems } from "../../utils.ssr"

/**
 * CreateDialog
 */
export const CreateDialog: React.FC<Ui.QuickDialogProps<number>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      {...props}
      title={_("title")}
      description={_("description")}
      classNames={{ content: "sm:max-w-6xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogContent item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/*
  service: Api.TemplatesService
  serviceKey: string
  type: Api.TemplateType
  items: ContentContextType["items"]
  routeToTemplates: () => string
  routeToTemplate: (templateId: string) => string

*/
const DialogContent: React.FC<Ui.QuickDialogSafeProps<number>> = (props) => {
  const { _ } = useTranslation(dictionary)

  const tabProps = {
    order: props.item,
    close: props.close,
  }
  const { disabledTemplates } = useContent()
  if (disabledTemplates)
    return (
      <Ui.Tabs.Root defaultValue='items' className='pb-6'>
        <ContentItemsSelection {...tabProps} />
      </Ui.Tabs.Root>
    )
  return (
    <>
      <Ui.Tabs.Root defaultValue='items' className='pb-6'>
        <Ui.Tabs.List className='flex justify-end gap-4'>
          <Ui.Tabs.Trigger value='items'>{_("items-tab")}</Ui.Tabs.Trigger>
          <Ui.Tabs.Trigger value='templates'>{_("templates-tab")}</Ui.Tabs.Trigger>
        </Ui.Tabs.List>
        <ContentItemsSelection {...tabProps} />
        <ContentTemplatesSelection {...tabProps} />
      </Ui.Tabs.Root>
    </>
  )
  // <ContentItemsSelection {...props} />
}

const ContentTemplatesSelection: React.FC<{ order: number; close: () => void }> = ({ order, close }) => {
  const { _ } = useTranslation(dictionary)
  const { templates } = useSwrTemplates()
  const searchId = React.useId()
  const { service, swr } = useContent()

  const [isCreating, setIsCreating] = React.useState(false)

  const createItem = async (template: Api.TemplateWithRelations) => {
    if (isCreating) return
    setIsCreating(true)
    const result = await service.items.fromTemplate({ templateId: template.id, order: order + 1 })
    match(result)
      .with({ failed: true }, () => {
        Ui.toast.error(_("error"))
      })
      .otherwise(({ data }) => {
        Ui.toast.success(_("created"))
        data.items.forEach((item) => {
          swr.appendItem(item, data.sortedIds)
        })
        close()
      })
    setIsCreating(false)
  }
  return (
    <Ui.Tabs.Content value='templates'>
      <Primitives.Command className='w-full outline-none'>
        <div className='relative w-full'>
          <label
            className={cxm(variants.inputIcon({ side: "left", className: "text-muted-foreground" }))}
            htmlFor={searchId}
          >
            <Search aria-hidden />
            <Ui.SrOnly>{_("templates-search-label")}</Ui.SrOnly>
          </label>
          <Primitives.Command.Input
            id={searchId}
            className={variants.input({ icon: "both" })}
            placeholder={_("templates-search-placeholder")}
          />
        </div>
        <Primitives.Command.List className='pt-8 [&>[cmdk-list-sizer]]:grid [&>[cmdk-list-sizer]]:grid-cols-3 [&>[cmdk-list-sizer]]:gap-2'>
          <Primitives.Command.Empty className='flex flex-col col-span-3 items-center justify-center gap-4 px-4 py-8 text-muted-foreground'>
            <Search className='size-8 stroke-[1]' aria-hidden />
            <div className='text-sm'>{_("templates-empty-result")}</div>
          </Primitives.Command.Empty>
          {A.map(templates, (template) => (
            <CardTemplate key={template.id} template={template} createItem={createItem} />
          ))}
        </Primitives.Command.List>
      </Primitives.Command>
    </Ui.Tabs.Content>
  )
}
const CardTemplate: React.FC<{
  template: Api.TemplateWithRelations
  createItem: (template: Api.TemplateWithRelations) => void
}> = ({ template, createItem }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const translated = translate(template, servicePlaceholder.template)
  const title = placeholder(translated.title, _("template-untitled"))
  const description = placeholder(translated.description, _("template-no-description"))
  return (
    <Primitives.Command.Item
      keywords={[title, description, ...translated.tags]}
      value={template.id}
      onSelect={() => createItem(template)}
      className={cxm(
        "hover:bg-gray--500/25 relative flex flex-col overflow-hidden rounded-md p-2 pb-0 transition-colors duration-300 ease-in-out data-[selected=true]:bg-gray-500/25"
      )}
    >
      <Ui.SrOnly>{_("template-create")}</Ui.SrOnly>
      <div className='flex flex-col text-left'>
        <div className='relative aspect-video max-h-full w-full max-w-full overflow-hidden rounded-md'>
          <Thumbnail template={template} />
          <div className='absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-background' />
        </div>
        <div className='w-full p-2 text-xs/tight font-medium text-muted-foreground'>
          <span className='line-clamp-1'>{title}</span>
        </div>
      </div>
      <div className='absolute right-2 top-2' onClick={(e) => e.stopPropagation()}>
        <Ui.Popover.Quick
          align='start'
          side='left'
          content={
            <>
              <h3 className='text-base font-medium'>{title}</h3>
              <p className='text-sm text-muted-foreground'>{description}</p>
            </>
          }
          asChild
        >
          <Ui.Button variant='ghost' icon size='xxs' tabIndex={-1}>
            <Info aria-hidden />
            <Ui.SrOnly>{_("template-popover-info")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Popover.Quick>
      </div>
    </Primitives.Command.Item>
  )
}

/**
 * ContentItemsSelection
 * display the list of content items to create
 */
const ContentItemsSelection: React.FC<{ order: number; close: () => void }> = ({ order, close }) => {
  const { _, language } = useTranslation(dictionary)
  const { languages } = useLanguages()
  const { service, items, swr } = useContent()
  const itemsArray = flattenClientItems(items)
  const [isCreating, setIsCreating] = React.useState(false)

  const createItem = async (exportItem: ExportedItem) => {
    // Prevent multiple simultaneous creations
    if (isCreating) return

    setIsCreating(true)
    const payload = createPayload({ order: order + 1, state: "draft", ...exportItem }, languages)

    match(await service.items.create(payload))
      .with({ failed: true }, () => {
        Ui.toast.error(_("error"))
        setIsCreating(false)
      })
      .otherwise(({ data }) => {
        Ui.toast.success(_("created"))
        swr.appendItem(data.item, data.sortedIds)
        close()
        // No need to reset isCreating since dialog is closing
      })
  }

  const categories = React.useMemo(() => {
    // list items by category
    const byCategories = A.map(D.toPairs(items), ([category, itemInCategory]) => {
      const items = D.values(itemInCategory)
      //  sort items by display name
      const sortedItems = items.sort((a, b) => {
        const nameA = makeDictionary(D.get(a.export.dictionary, language) ?? {})("display-name")
        const nameB = makeDictionary(D.get(b.export.dictionary, language) ?? {})("display-name")
        return nameA.localeCompare(nameB)
      })

      return [category, sortedItems] as const
    })

    // sort categories by display name
    const categories = byCategories.sort(([a], [b]) => {
      const nameA = _(`category-${a}-title`)
      const nameB = _(`category-${b}-title`)
      return nameA.localeCompare(nameB)
    })

    return categories
  }, [itemsArray, language, _])

  const searchId = React.useId()
  return (
    <Ui.Tabs.Content value='items'>
      <Primitives.Command className='w-full outline-none'>
        <div className='relative w-full'>
          <label
            className={cxm(variants.inputIcon({ side: "left", className: "text-muted-foreground" }))}
            htmlFor={searchId}
          >
            <Search aria-hidden />
            <Ui.SrOnly>{_("search-placeholder")}</Ui.SrOnly>
          </label>
          <Primitives.Command.Input
            id={searchId}
            className={variants.input({ icon: "both" })}
            placeholder={_("search-placeholder")}
          />
        </div>
        <Primitives.Command.List className='divide-y'>
          <Primitives.Command.Empty className='flex flex-col items-center justify-center gap-4 px-4 py-8 text-muted-foreground'>
            <Search className='size-8 stroke-[1]' aria-hidden />
            <div className='text-sm'>{_("empty-result")}</div>
          </Primitives.Command.Empty>
          {categories.map(([category, items], index) => (
            <Primitives.Command.Group
              key={category}
              value={category}
              className={cxm(
                "mt-8 border-muted pb-8 [&>[cmdk-group-items]]:grid [&>[cmdk-group-items]]:grid-cols-3 [&>[cmdk-group-items]]:gap-2",
                index < categories.length - 1 && "border-b"
              )}
              heading={
                <div className='flex flex-col space-y-1 pb-4'>
                  <div className='text-sm font-bold'>{_(`category-${category}-title`)}</div>
                  <div className='text-xs text-muted-foreground'>{_(`category-${category}-description`)}</div>
                </div>
              }
            >
              {items.map((item) => (
                <CardItem key={item.export.type} item={item} category={category} createItem={createItem} />
              ))}
            </Primitives.Command.Group>
          ))}
        </Primitives.Command.List>
      </Primitives.Command>
    </Ui.Tabs.Content>
  )
}
const CardItem: React.FC<{
  item: ItemSync<ExportedItem>
  category: string
  createItem: (exportItem: ExportedItem) => void
}> = ({ item, category, createItem }) => {
  const { _ } = useTranslation(dictionary)
  const { _: __ } = useTranslation(item.export.dictionary)
  const Thumbnail = item.Thumbnail
  return (
    <Primitives.Command.Item
      keywords={[__("display-name"), _(`category-${category}-title`)]}
      value={item.export.type}
      onSelect={() => createItem(item.export)}
      className={cxm(
        "hover:bg-gray--500/25 relative flex flex-col overflow-hidden rounded-md p-2 pb-0 transition-colors duration-300 ease-in-out data-[selected=true]:bg-gray-500/25"
      )}
    >
      <Ui.SrOnly>{_("create")}</Ui.SrOnly>
      <div className='pointer-events-none relative flex flex-col'>
        <div className='relative aspect-video max-h-full w-full max-w-full rounded-md'>
          <Thumbnail />
          <div className='absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-background' />
        </div>
        <div className='w-full p-2 text-xs/tight font-medium text-muted-foreground'>
          <span className='line-clamp-1'>{__("display-name")}</span>
        </div>
      </div>
      <div className='absolute right-2 top-2' onClick={(e) => e.stopPropagation()}>
        <Ui.Popover.Quick
          align='start'
          side='left'
          content={
            <>
              <h3 className='text-base font-medium'>{__("popover.title")}</h3>
              <p className='text-sm text-muted-foreground'>{__("popover.description")}</p>
            </>
          }
          asChild
        >
          <Ui.Button variant='ghost' icon size='xxs' tabIndex={-1}>
            <Info aria-hidden />
            <Ui.SrOnly>{_("popover-info")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Popover.Quick>
      </div>
    </Primitives.Command.Item>
  )
}

const dictionary = {
  fr: {
    "items-tab": "Blocks de contenu",
    "templates-tab": "Modèles",
    "template-untitled": "Modèle sans titre",
    "template-no-description": "Aucune description",
    "template-create": "Créer à partir de ce modèle",
    "template-popover-info": "En savoir plus sur le modèle",
    "templates-search-label": "Rechercher un modèle",
    "templates-search-placeholder": "Rechercher un modèle",
    "templates-empty-result": "Aucun modèle ne correspond à votre recherche",
    title: "Créer un block de contenu",
    description: "Sélectionnez le type de block de contenu que vous souhaitez créer",
    "search-placeholder": "Rechercher un block de contenu",
    "empty-result": "Aucun résultat ne correspond à votre recherche",
    "category-contents-title": "Contenu principal",
    "category-contents-description": "Ajoutez des textes et des paragraphes pour raconter votre histoire.",
    "category-cta-title": "Appels à l'action",
    "category-cta-description": "Encouragez vos visiteurs à passer à l'action avec des sections percutantes.",
    "category-features-title": "Fonctionnalités et Témoignages",
    "category-features-description":
      "Regroupez vos cartes, carrousels, fonctionnalités et témoignages dans une collection élégante.",
    "category-projects-title": "Projets",
    "category-projects-description":
      "Regroupez vos projets dans une collection ou proposez de projets à vos visiteurs.",
    "category-headings-title": "En-tête de page",
    "category-headings-description": "Organisez votre contenu en ajoutant des titres et des sous-titres.",
    "category-hero-title": "Héros de page",
    "category-hero-description": "Les sections qui attirent l’attention dès le premier regard.",
    "category-interactives-title": "Interactions",
    "category-interactives-description": "Ajoutez des interactions pour rendre votre contenu dynamique.",
    "category-medias-title": "Galeries et Médias",
    "category-medias-description": "Présentez vos photos, vidéos ou carrousels de manière élégante.",
    "category-related-title": "Blocs associés",
    "category-related-description": "Mettez en avant du contenu lié, comme des articles ou des équipes",
    create: "Créer",
    "popover-info": "En savoir plus sur le block de contenu",
    created: "Le block de contenu a été créé",
    error: "Une erreur est survenue lors de la création du block de contenu",
  },
  de: {
    "items-tab": "Inhalts-Blöcke",
    "templates-tab": "Vorlagen",
    "template-untitled": "Unbenannte Vorlage",
    "template-no-description": "Keine Beschreibung",
    "template-create": "Aus dieser Vorlage erstellen",
    "template-popover-info": "Mehr über die Vorlage erfahren",
    "templates-search-label": "Nach einer Vorlage suchen",
    "templates-search-placeholder": "Nach einer Vorlage suchen",
    "templates-empty-result": "Keine Vorlage entspricht Ihrer Suche",
    title: "Einen Inhalts-Block erstellen",
    description: "Wählen Sie den Typ des Inhalts-Blocks aus, den Sie erstellen möchten",
    "search-placeholder": "Nach einem Inhalts-Block suchen",
    "empty-result": "Keine Ergebnisse entsprechen Ihrer Suche",
    "category-contents-title": "Hauptinhalt",
    "category-contents-description": "Fügen Sie Texte und Absätze hinzu, um Ihre Geschichte zu erzählen.",
    "category-cta-title": "Call-to-Actions",
    "category-cta-description": "Ermutigen Sie Ihre Besucher mit wirkungsvollen Abschnitten zum Handeln.",
    "category-features-title": "Funktionen und Testimonials",
    "category-features-description":
      "Gruppieren Sie Ihre Karten, Karussells, Funktionen und Testimonials in einer eleganten Sammlung.",
    "category-projects-title": "Projekte",
    "category-projects-description": "Gruppieren Sie Ihre Projekte in einer eleganten Sammlung.",
    "category-headings-title": "Seitenkopf",
    "category-headings-description": "Organisieren Sie Ihren Inhalt durch das Hinzufügen von Titeln und Untertiteln.",
    "category-hero-title": "Hero-Bereich",
    "category-hero-description": "Die Abschnitte, die auf den ersten Blick Aufmerksamkeit erregen.",
    "category-interactives-title": "Interaktionen",
    "category-interactives-description": "Fügen Sie Interaktionen hinzu, um Ihren Inhalt dynamisch zu gestalten.",
    "category-medias-title": "Galerien und Medien",
    "category-medias-description": "Präsentieren Sie Ihre Fotos, Videos oder Karussells auf elegante Weise.",
    "category-related-title": "Verwandte Blöcke",
    "category-related-description": "Heben Sie verwandte Inhalte hervor, wie Artikel oder Teams",
    create: "Erstellen",
    "popover-info": "Mehr über den Inhalts-Block erfahren",
    created: "Der Inhalts-Block wurde erstellt",
    error: "Ein Fehler ist beim Erstellen des Inhalts-Blocks aufgetreten",
  },
  en: {
    "items-tab": "Content blocks",
    "templates-tab": "Templates",
    "template-untitled": "Untitled template",
    "template-no-description": "No description",
    "template-create": "Create from this template",
    "template-popover-info": "Learn more about the template",
    "templates-search-label": "Search for a template",
    "templates-search-placeholder": "Search for a template",
    "templates-empty-result": "No template matches your search",
    title: "Create a content block",
    description: "Select the type of content block you want to create",
    "search-placeholder": "Search for a content block",
    "empty-result": "No results match your search",
    "category-contents-title": "Main content",
    "category-contents-description": "Add texts and paragraphs to tell your story.",
    "category-cta-title": "Calls to action",
    "category-cta-description": "Encourage your visitors to take action with catchy sections.",
    "category-features-title": "Features and Testimonials",
    "category-features-description": "Group your cards, carousels, features and testimonials in an elegant collection.",
    "category-projects-title": "Projects",
    "category-projects-description": "Group your projects in an elegant collection or offer projects to your visitors.",
    "category-headings-title": "Page heading",
    "category-headings-description": "Organise your content by adding titles and subtitles.",
    "category-hero-title": "Hero section",
    "category-hero-description": "The sections that catch the attention from the first glance.",
    "category-interactives-title": "Interactions",
    "category-interactives-description": "Add interactions to make your content dynamic.",
    "category-medias-title": "Galleries and media",
    "category-medias-description": "Present your photos, videos or carousels in an elegant way.",
    "category-related-title": "Related blocks",
    "category-related-description": "Highlight related content, like articles or teams",
    create: "Create",
    "popover-info": "Learn more about the content block",
    created: "The content block has been created",
    error: "An error occurred while creating the content block",
  },
}
