import { Translation, useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, cxm, F, placeholder, S } from "@compo/utils"
import { placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { Edit, Link2 } from "lucide-react"
import React from "react"
import { type SeoContextType, useSeo } from "../seo.context"
import { SeoProvider } from "../seo.context.provider"

/**
 * Seo
 * display the seo and each feature to update it
 */
export type SeoProps = SeoInnerProps & Omit<SeoContextType, "contextId" | "edit">
export const Seo: React.FC<SeoProps> = ({
  title,
  placeholder,
  slug,
  children,
  beforeAside,
  aside,
  beforeSlug,
  ...props
}) => {
  const innerProps = { title, placeholder, slug, children, beforeAside, aside, beforeSlug, ...props }
  return (
    <SeoProvider {...props}>
      <SeoInner {...innerProps} />
    </SeoProvider>
  )
}

/**
 * SeoInner
 * the inner component of the seo component
 */
type SeoInnerProps = {
  title?: string
  placeholder: string
  slug?: {
    path: string
    url: string
  }
  children?: React.ReactNode
  beforeSlug?: React.ReactNode
  beforeAside?: React.ReactNode
  aside?: React.ReactNode
}
const SeoInner: React.FC<SeoInnerProps> = ({ title, beforeSlug, beforeAside, children, aside, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { seo, persistedId, edit } = useSeo()
  const {
    service: { getImageUrl },
  } = useDashboardService()
  const { translate, current, langIfNotEmpty, t } = useContextualLanguage()
  const seoTranslated = translate(seo, servicePlaceholder.seo)
  const image = seoTranslated.image
    ? {
        url: getImageUrl(seoTranslated.image) ?? "",
        alt: translate(seoTranslated.image, servicePlaceholder.mediaFile).alt,
      }
    : null

  const slugInputId = React.useId()
  const slugRef = React.useRef<HTMLInputElement>(null)
  const selectSlug = () => {
    if (slugRef.current) {
      slugRef.current.select()
    }
  }
  return (
    <Ui.CollapsibleCard.Root id={persistedId}>
      <Ui.CollapsibleCard.Header>
        <Ui.CollapsibleCard.Title>{title || _("title")}</Ui.CollapsibleCard.Title>
        <Ui.CollapsibleCard.Aside>
          {beforeAside}
          <Ui.Tooltip.Quick tooltip={_("edit")} side='left' asChild>
            <Ui.Button variant='ghost' size='xs' icon onClick={edit}>
              <Edit aria-hidden />
              <Ui.SrOnly>{_("edit")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
          {aside}
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container/seo overflow-hidden'>
        <div className='flex flex-col-reverse flex-wrap gap-6 px-6 pb-6 @2xl/seo:flex-row @2xl/seo:flex-nowrap'>
          <div className='grid grow grid-rows-[auto_auto_1fr] space-y-4 pt-2'>
            <div className='space-y-2'>
              <h3 className='text-base leading-tight font-medium' lang={langIfNotEmpty(seoTranslated.title)}>
                {placeholder(seoTranslated.title, _("title-placeholder", { language: t(current.code).toLowerCase() }))}
              </h3>
              <p
                className='text-muted-foreground text-sm leading-relaxed'
                lang={langIfNotEmpty(seoTranslated.description)}
              >
                {placeholder(
                  seoTranslated.description,
                  _("description-placeholder", { language: t(current.code).toLowerCase() })
                )}
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {A.isNotEmpty(seoTranslated.keywords) ? (
                A.mapWithIndex(seoTranslated.keywords, (index, keyword) => (
                  <Ui.Badge key={index} variant='outline' lang={current.code}>
                    {keyword}
                  </Ui.Badge>
                ))
              ) : (
                <Ui.Badge variant='destructive-outline' className='text-muted-foreground text-sm leading-relaxed'>
                  {_("no-keywords", { language: t(current.code).toLowerCase() })}
                </Ui.Badge>
              )}
            </div>
            {beforeSlug}
            {props.slug && (
              <div className='flex items-end justify-start'>
                <div
                  className={cxm("relative isolate max-w-lg w-full", S.isEmpty(props.slug.path) && "text-destructive")}
                >
                  <label
                    htmlFor={slugInputId}
                    className={variants.inputIcon({
                      size: "default",
                      side: "left",
                      className: "text-muted-foreground z-10",
                    })}
                  >
                    <Link2 aria-hidden className='size-4' />
                  </label>
                  <input
                    type='text'
                    id={slugInputId}
                    value={props.slug.path}
                    ref={slugRef}
                    onFocus={selectSlug}
                    onChange={F.ignore}
                    className={variants.input({ icon: "both", size: "default" })}
                  />
                  {S.isNotEmpty(props.slug.path) && (
                    <Ui.CopyToClipboardButton
                      value={props.slug.url}
                      size='xs'
                      variant='ghost'
                      className={variants.inputIcon({ size: "default", side: "right" })}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className='aspect-[120/63] h-auto w-full @2xl/seo:h-48 @2xl/seo:w-auto'>
            {image ? (
              <Ui.Image
                src={image.url}
                alt={image.alt}
                lang={current.code}
                className='bg-muted aspect-[120/63] rounded-md object-cover object-center @2xl/seo:h-48 @2xl/seo:w-auto'
              >
                <Ui.ImageEmpty />
              </Ui.Image>
            ) : (
              <Ui.Image className='bg-muted aspect-[120/63] rounded-md @2xl/seo:h-48 @2xl/seo:w-auto'>
                <Ui.ImageEmpty />
              </Ui.Image>
            )}
          </div>
        </div>
        {children}
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

const dictionary = {
  fr: {
    title: "SEO",
    "title-placeholder": "Aucun titre en {{language}}",
    "description-placeholder": "Aucune description en {{language}}",
    "empty-slug": "le slug est vide",
    edit: "Modifier le SEO",
    "no-keywords": "Aucun mot-clé en {{language}}",
  },
  en: {
    title: "SEO",
    "title-placeholder": "No title in {{language}}",
    "description-placeholder": "No description in {{language}}",
    "empty-slug": "the slug is empty",
    edit: "Edit SEO",
    "no-keywords": "No keywords in {{language}}",
  },
  de: {
    title: "SEO",
    "title-placeholder": "Kein Titel in {{language}}",
    "description-placeholder": "Keine Beschreibung in {{language}}",
    "empty-slug": "der Slug ist leer",
    edit: "SEO bearbeiten",
    "no-keywords": "Keine Schlüsselwörter in {{language}}",
  },
} satisfies Translation
