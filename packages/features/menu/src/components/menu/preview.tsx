import { useTranslation } from "@compo/localize"
import { getSlugResource } from "@compo/slugs"
import { useContextualLanguage } from "@compo/translations"
import { Icon, Ui } from "@compo/ui"
import { appendQS, G, match, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { ImageOff, TriangleAlert } from "lucide-react"
import React from "react"
import { useMenusService } from "../../service.context"

/**
 * Preview - Simplified version for @compo packages
 */
export const Preview: React.FC<{
  item: Api.MenuItemWithRelations
}> = ({ item }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()

  const translation = translate({ translations: item.translations }, { name: _("name-ph") })

  return (
    <div className='relative flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-md border bg-card text-xs text-muted-foreground shadow-lg'>
      {match(item.type)
        .with("resource", () => <PreviewResource item={item} />)
        .with("link", () => <PreviewLink item={item} />)
        .with("url", () => <PreviewUrl item={item} />)
        .otherwise(() => null)}
    </div>
  )
}

/**
 * Preview Resource
 * display resource seo attached to the slug
 */
const PreviewResource: React.FC<{
  item: Api.MenuItemWithRelations
}> = ({ item }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useMenusService()
  const {
    translate,
    current: { code },
  } = useContextualLanguage()
  if (G.isNullable(item.slug))
    return (
      <>
        <TriangleAlert aria-hidden className='size-8 stroke-[1]' />
        <p>{_("no-ressource-selected")}</p>
      </>
    )

  const resource = getSlugResource(item.slug)
  const seoTranslated = translate(resource.seo, servicePlaceholder.seo)
  const isPublished = resource?.state === "published"
  const image = seoTranslated.image
    ? {
        url: getImageUrl(seoTranslated.image, "preview") ?? "",
        alt: translate(seoTranslated.image, servicePlaceholder.mediaFile),
      }
    : null
  return (
    <>
      {image ? (
        <Ui.Image
          src={getImageUrl(seoTranslated.image, "preview") ?? ""}
          alt={seoTranslated.image ?? ""}
          lang={code}
          className='absolute inset-0 size-full object-cover object-center'
        >
          <ImageOff aria-hidden className='!size-8 stroke-[1] text-muted' />
        </Ui.Image>
      ) : (
        <>
          <TriangleAlert aria-hidden className='!size-8 stroke-[1] text-muted' />
          <p>{_("no-image-selected")}</p>
        </>
      )}
      <div className='absolute inset-0 flex size-full flex-col justify-end bg-black/50 p-4 pb-2 text-white'>
        <div className='flex flex-col gap-0.5'>
          <p className='text-sm font-medium'>{seoTranslated.title}</p>
          {/* <p className='line-clamp-3 text-xs'>{seoTranslated.description}</p> */}
          <p className='line-clamp-1 text-xs font-medium'>/{item.slug?.path}</p>
        </div>
      </div>
      {!isPublished && (
        <div className='absolute inset-0 flex size-full flex-col items-center justify-center gap-2 bg-destructive/50 text-white'>
          <TriangleAlert aria-hidden className='size-8 stroke-[1]' />
          <p>{_("is-draft")}</p>
        </div>
      )}
    </>
  )
}

/**
 * Preview Link
 * display a screenshot of the link
 */

const PreviewLink: React.FC<{
  item: Api.MenuItemWithRelations
}> = ({ item }) => {
  const { makeUrl } = useMenusService()
  const { _ } = useTranslation(dictionary)

  if (G.isString(item.props?.link) && S.isNotEmpty(item.props?.link))
    return <Screenshot url={makeUrl(item.props.link)} />
  return (
    <>
      <TriangleAlert aria-hidden className='size-8 stroke-[1]' />
      <p>{_("no-link-selected")}</p>
    </>
  )
}

/**
 * Preview Url
 * display a screenshot of the url
 */
const PreviewUrl: React.FC<{
  item: Api.MenuItemWithRelations
}> = ({ item }) => {
  const { translate } = useContextualLanguage()
  const { _ } = useTranslation(dictionary)
  const translated = translate(item, servicePlaceholder.menuItem)
  if (G.isString(translated.props?.url) && S.isNotEmpty(translated.props?.url)) {
    return <Screenshot url={translated.props.url} />
  }
  return (
    <>
      <TriangleAlert aria-hidden className='size-8 stroke-[1]' />
      <p className='text-sm text-muted-foreground'>{_("no-url-selected")}</p>
    </>
  )
}

/**
 * Screenshot
 * display a screenshot of the url
 */
const Screenshot: React.FC<{
  url: string
}> = ({ url }) => {
  const { _ } = useTranslation(dictionary)
  const { makePath } = useMenusService()

  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  // generate the url of the screenshot
  const src = React.useMemo(() => {
    const apiUrl = makePath("api/previews", true)
    const query = {
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": false,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": 1920,
      "viewport.height": 1080,
    }
    return appendQS(apiUrl, query)
  }, [url])

  // reset state when src changes
  React.useEffect(() => {
    if (G.isNotNullable(src)) {
      setIsLoading(true)
      setHasError(false)
    }
  }, [src])

  return (
    <>
      <img
        src={src}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        className='hidden'
        aria-hidden
      />
      {isLoading && (
        <>
          <Icon.Loader variant='dots' className='size-8' />
          <p>{_("preview-url-loading")}</p>
        </>
      )}
      {hasError && (
        <>
          <TriangleAlert className='size-8 stroke-[1]' />
          <p>{_("preview-url-error")}</p>
        </>
      )}
      {!isLoading && !hasError && (
        <>
          <Ui.Image src={src} alt={_(`alt`, { url })} className='absolute inset-0 size-full object-cover object-top' />
          <p className='absolute inset-x-0 bottom-0 line-clamp-1 bg-black/50 px-4 py-2 text-xs font-bold text-white'>
            {url}
          </p>
        </>
      )}
    </>
  )
}
/**
 * translations
 */
const dictionary = {
  fr: {
    "name-ph": "Élément sans nom",
    "no-resource-selected": "Aucune ressource sélectionnée",
    "no-link-selected": "Aucun lien sélectionné",
    "no-url-selected": "Aucune URL sélectionnée",
    untitled: "Sans titre",
    "is-draft": "Cette ressource n'est pas publiée",
    "internal-link": "Lien interne",
    "external-link": "Lien externe",
    "group-item": "Groupe d'éléments",
    "contains-subitems": "Contient des sous-éléments",
    "unknown-type": "Type d'élément inconnu",
    "preview-url-loading": "Chargement de l'aperçu...",
    "preview-url-error": "Erreur lors de l'affichage de l'aperçu",
  },
  de: {
    "name-ph": "Element ohne Namen",
    "no-resource-selected": "Keine Ressource ausgewählt",
    "no-link-selected": "Kein Link ausgewählt",
    "no-url-selected": "Keine URL ausgewählt",
    untitled: "Ohne Titel",
    "is-draft": "Diese Ressource ist nicht veröffentlicht",
    "internal-link": "Interner Link",
    "external-link": "Externer Link",
    "group-item": "Elementgruppe",
    "contains-subitems": "Enthält Unterelemente",
    "unknown-type": "Unbekannter Elementtyp",
    "preview-url-loading": "Vorschau wird geladen...",
    "preview-url-error": "Fehler beim Laden der Vorschau",
  },
  en: {
    "name-ph": "Unnamed item",
    "no-resource-selected": "No resource selected",
    "no-link-selected": "No link selected",
    "no-url-selected": "No URL selected",
    untitled: "Untitled",
    "is-draft": "This resource is not published",
    "internal-link": "Internal link",
    "external-link": "External link",
    "group-item": "Group of items",
    "contains-subitems": "Contains sub-items",
    "unknown-type": "Unknown item type",
    "preview-url-loading": "Loading preview...",
    "preview-url-error": "Error loading preview",
  },
}
