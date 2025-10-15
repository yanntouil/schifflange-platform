import {
  extractGroupProps,
  extractInputProps,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "@compo/form"
import { normString } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, cx, cxm, D, O, pipe, placeholder } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, ImageOff, LayoutPanelTop, Newspaper, Presentation } from "lucide-react"
import { matchSorter } from "match-sorter"
import React from "react"
import { useSlugsService } from "../service.context"
import { useSWRSlugs } from "../swr"
import { getSlugSeo, isSlugArticle, isSlugPage, isSlugProject, isSlugProjectStep } from "../utils"

/**
 * FormSlug
 */
export type FormSlugProps = FormGroupProps &
  FieldProps & {
    classNames?: FormGroupClassNames<FieldProps["classNames"]>
  }

export const FormSlug: React.FC<FormSlugProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <Field {...extractInputProps({ ...props })} classNames={classNames} />
    </FormGroup>
  )
}

/**
 * Field
 */
type FieldProps = {
  disabled?: boolean
  placeholder?: string
  classNames?: {
    trigger: string
    content: string
    placeholder: string
  }
}
const Field: React.FC<FieldProps> = ({ disabled, classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { slugs } = useSWRSlugs()
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string>()
  const isDisabled = disabled || ctxDisabled

  const [searchQuery, setSearchQuery] = React.useState("")

  const [filters, setFilters] = React.useState<Model[]>([])
  const slugsByModel = useSlugByModel(slugs, searchQuery)
  type Model = keyof typeof slugsByModel
  const models = D.keys(slugsByModel)
  const isActiveFilter = (model: Model | string) => filters.includes(model as Model) || filters.length === 0
  const isSelectedFilter = (model: Model | string) => filters.includes(model as Model)
  const toggleFilter = (model: Model | string) => {
    if (filters.includes(model as Model)) {
      setFilters((filters) => A.filter(filters, (f) => f !== model))
    } else {
      setFilters((filters) => A.append(filters, model as Model))
    }
  }

  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [state, setState] = React.useState(value)
  const current = React.useMemo(() => A.find(slugs, (c) => c.id === value), [slugs, value])

  const onSelect = (slug: Api.Slug & Api.WithModel) => {
    setPopoverOpen(false)
    setFieldValue(slug.id)
    setState(slug.id)
  }

  return (
    <div>
      <Ui.Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen} modal>
        <Ui.Popover.Trigger
          role='combobox'
          aria-expanded={popoverOpen}
          disabled={isDisabled}
          className={cx(
            variants.focusVisible(),
            variants.disabled(),
            "border-input bg-card ring-offset-background placeholder:text-muted-foreground hover:bg-card grid min-h-9 w-full grid-cols-[1fr_auto] items-start rounded-md border p-1.5 text-left text-sm",
            classNames?.trigger
          )}
        >
          {current ? (
            <FieldValue slug={current} />
          ) : (
            <span className={cx("text-muted-foreground mx-1.5 line-clamp-1 py-[1px] text-sm", classNames?.placeholder)}>
              {props.placeholder}
            </span>
          )}
          <div className='flex items-center gap-2 mx-2 my-auto'>
            {A.map(models, (model) => (
              <Ui.Tooltip.Quick key={model} tooltip={_(`model-${model}`)} asChild>
                <span
                  key={model}
                  className={cxm(
                    "[&>svg]:size-4",
                    isSelectedFilter(model)
                      ? "[&>svg]:stroke-1.5 text-primary"
                      : "[&>svg]:stroke-1 text-foreground opacity-50"
                  )}
                  onClick={() => toggleFilter(model)}
                >
                  {model === "pages" && <LayoutPanelTop aria-label={_(`model-${model}`)} />}
                  {model === "articles" && <Newspaper aria-label={_(`model-${model}`)} />}
                  {model === "projects" && <Presentation aria-label={_(`model-${model}`)} />}
                </span>
              </Ui.Tooltip.Quick>
            ))}
            <ChevronsUpDown className='text-foreground size-4 opacity-50' aria-hidden />
          </div>
        </Ui.Popover.Trigger>
        <Ui.Popover.Content
          className={cx("z-50 w-[var(--radix-popper-anchor-width)] p-0", classNames?.content)}
          align='start'
          onEscapeKeyDown={() => setPopoverOpen(false)}
        >
          <Ui.Command.Root value={state} onValueChange={setState} disablePointerSelection shouldFilter={false}>
            <Ui.Command.Input placeholder={_("search")} value={searchQuery} onValueChange={setSearchQuery} />
            <Ui.Command.List>
              <Ui.Command.Empty>{_("no-results-found")}</Ui.Command.Empty>
              {A.filterMap(D.toPairs(slugsByModel), ([model, slugs]) =>
                A.isNotEmpty([...slugs]) && isActiveFilter(model) ? (
                  <Ui.Command.Group key={model} heading={_(`model-${model}`)}>
                    {A.map([...slugs], (slug) => (
                      <Option key={slug.id} slug={slug} onSelect={onSelect} steps={"steps" in slug ? slug.steps : []} />
                    ))}
                  </Ui.Command.Group>
                ) : (
                  O.None
                )
              )}
            </Ui.Command.List>
          </Ui.Command.Root>
        </Ui.Popover.Content>
      </Ui.Popover.Root>
    </div>
  )
}

const FieldValue: React.FC<{
  slug: Api.Slug & Api.WithModel
}> = ({ slug }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useSlugsService()
  const {
    translate,
    current: { code },
  } = useLanguage()
  const seo = getSlugSeo(slug)
  const seoTranslated = translate(seo, servicePlaceholder.seo)
  const image = seoTranslated?.image
  return (
    <div className='flex items-center gap-4'>
      <Ui.Image
        src={getImageUrl(image, "preview") || ""}
        alt={image ? translate(image, servicePlaceholder.mediaFile).alt : ""}
        lang={code}
        className='bg-muted aspect-square w-20 rounded object-cover object-center'
      >
        <ImageOff aria-hidden className='text-muted-foreground !size-6 stroke-[1.2]' />
      </Ui.Image>
      <div>
        <div className='line-clamp-1 text-base leading-relaxed font-medium'>
          {placeholder(seoTranslated?.title, _(`title-ph`))}
        </div>
        <div className='text-primary line-clamp-1 text-xs leading-none'>{slug.path}</div>
        <div className='text-muted-foreground line-clamp-2 pt-2 text-xs leading-tight'>
          {placeholder(seoTranslated?.description, _(`description-ph`))}
        </div>
      </div>
    </div>
  )
}

const Option: React.FC<{
  slug: Api.Slug & Api.WithModel
  steps: (Api.Slug & Api.WithProjectStep)[]
  onSelect: (slug: Api.Slug & Api.WithModel) => void
}> = ({ slug, steps, onSelect }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useSlugsService()
  const {
    languages,
    translate,
    current: { code },
  } = useLanguage()
  const seo = getSlugSeo(slug)
  const seoTranslated = translate(seo, servicePlaceholder.seo)
  const keywords = React.useMemo(() => {
    const seoKeywords = A.reduce(languages, [] as string[], (acc, language) => {
      const { title, description } = translate.language(language.id)(seo, servicePlaceholder.seo)
      return [...acc, placeholder(title, _(`title-ph`)), placeholder(description, _(`description-ph`))]
    })
    return [slug.path, ...seoKeywords]
  }, [languages, translate, seo, slug.path, _])

  const option = (
    <Ui.Command.Item
      value={slug.id}
      className='flex items-center gap-4'
      onSelect={() => onSelect(slug)}
      keywords={keywords}
    >
      <Ui.Image
        src={getImageUrl(seoTranslated?.image, "preview") || ""}
        alt={seoTranslated?.image ? translate(seoTranslated.image, servicePlaceholder.mediaFile).alt : ""}
        lang={code}
        className='bg-muted aspect-square w-20 rounded object-cover object-center'
      >
        <ImageOff aria-hidden className='text-muted-foreground !size-6 stroke-[1.2]' />
      </Ui.Image>
      <div>
        <div className='line-clamp-1 text-base leading-relaxed font-medium'>
          {placeholder(seoTranslated?.title, _(`title-ph`))}
        </div>
        <div className='text-primary line-clamp-1 text-xs leading-none'>{slug.path}</div>
        <div className='text-muted-foreground line-clamp-2 pt-2 text-xs leading-tight'>
          {placeholder(seoTranslated?.description, _(`description-ph`))}
        </div>
      </div>
    </Ui.Command.Item>
  )
  if (A.isNotEmpty(steps)) {
    return (
      <>
        {option}
        <Ui.Command.Group
          heading={_("model-project-steps", {
            project: placeholder(translate(getSlugSeo(slug), servicePlaceholder.seo).title, _(`title-ph`)),
          })}
          className='p-2 m-2 border'
        >
          {A.map(steps, (step) => (
            <Option key={step.id} slug={step} onSelect={() => onSelect(step)} steps={[]} />
          ))}
        </Ui.Command.Group>
      </>
    )
  }
  return option
}

const useSlugByModel = (slugs: (Api.Slug & Api.WithModel)[], searchQuery: string) => {
  const { _ } = useTranslation(dictionary)
  const { translate, languages } = useLanguage()

  const keys = React.useMemo(() => {
    return pipe(
      languages,
      A.map(({ id }) => [
        (slug: Api.Slug & Api.WithModel) =>
          placeholder(translate.language(id)(getSlugSeo(slug), servicePlaceholder.seo).title, _(`title-ph`)),
        (slug: Api.Slug & Api.WithModel) =>
          placeholder(
            translate.language(id)(getSlugSeo(slug), servicePlaceholder.seo).description,
            _(`description-ph`)
          ),
      ]),
      A.flat,
      A.append((slug: Api.Slug & Api.WithModel) => slug.path)
    )
  }, [languages, translate, _])

  const slugsByModel = React.useMemo(() => {
    const sortedSlugs = A.sortBy(slugs, (item) => translate(getSlugSeo(item), servicePlaceholder.seo).title)
    const filteredSlugs = searchQuery ? matchSorter(sortedSlugs, normString(searchQuery), { keys }) : sortedSlugs
    const pages = A.filter(filteredSlugs, isSlugPage)
    const articles = A.filter(filteredSlugs, isSlugArticle)
    const projectSteps = A.filter(slugs, isSlugProjectStep)
    const projects = A.filterMap(filteredSlugs, (slug) => {
      if (!isSlugProject(slug)) return O.None
      const steps = A.sortBy(
        A.filter(projectSteps, ({ projectStep }) => projectStep.projectId === slug.project.id),
        ({ projectStep }) => projectStep.type
      )
      return O.Some(D.set(slug, "steps", steps))
    })
    return {
      pages,
      articles,
      projects,
    }
  }, [slugs, translate, searchQuery, keys])
  return slugsByModel
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "title-ph": "Ressource sans nom",
    "description-ph": "Aucune description pour cette ressource",
    "model-pages": "Pages",
    "model-articles": "Articles",
    "model-projects": "Projets",
    "model-project-steps": "Étapes du projet {{project}}",
    search: "Rechercher",
    "no-results-found": "Aucun résultat trouvé",
  },
  de: {
    "title-ph": "Unbenannte Ressource",
    "description-ph": "Keine Beschreibung für diese Ressource",
    "model-pages": "Seiten",
    "model-articles": "Artikel",
    "model-projects": "Projekte",
    "model-project-steps": "Projekt-Schritte",
    search: "Suchen",
    "no-results-found": "Keine Ergebnisse gefunden",
  },
  en: {
    "title-ph": "Unnamed resource",
    "description-ph": "No description for this resource",
    "model-pages": "Pages",
    "model-articles": "Articles",
    "model-projects": "Projects",
    "model-project-steps": "Project Steps",
    search: "Search",
    "no-results-found": "No results found",
  },
}
