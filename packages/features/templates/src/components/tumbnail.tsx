import { flattenClientItems } from "@compo/contents"
import { useTranslation } from "@compo/localize"
import { A, cxm, D, match, O, pipe } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useTemplatesService } from "../service.context"

/**
 * Thumbnail
 */
export const Thumbnail: React.FC<{ template: Api.TemplateWithRelations; className?: string }> = ({
  template,
  className,
}) => {
  const { _ } = useTranslation(dictionary)
  const { items } = useTemplatesService()
  const itemsArray = flattenClientItems(items)
  const templateItems = React.useMemo(() => {
    const first3TemplateItems = pipe(
      template.content.items,
      A.filter((item) => item.state === "published"),
      A.sortBy(D.prop("order")),
      A.map((item) => ({
        id: item.id,
        type: item.type,
        template: item.props?.template || null,
      })),
      A.take(4),
      A.filterMap((item) => {
        const current = A.find(itemsArray, (i) => i.export.type === item.type)
        if (!current) return O.None
        const Thumbnail = current.Thumbnail
        const template = item.template
        const templates = current.export.templates ?? {}
        const Template = D.get(templates, template)
        return O.Some({
          id: item.id,
          type: item.type,
          Preview: Template || Thumbnail,
        })
      })
    )
    return first3TemplateItems
  }, [template.content.items, itemsArray])

  return (
    <div className={cxm("aspect-video w-full overflow-hidden rounded bg-muted", className)}>
      {match(templateItems.length)
        .with(0, () => (
          <div className='flex size-full items-center justify-center text-sm text-muted-foreground'>{_("empty")}</div>
        ))
        .with(1, () =>
          A.map(templateItems, ({ id, type, Preview }) => (
            <div className='size-full rounded-sm overflow-hidden relative' key={id} data-slot={type}>
              <Preview />
              <span className='absolute inset-0 size-full text-black/40 text-4xl font-semibold flex justify-center items-center'>
                {1}
              </span>
            </div>
          ))
        )
        .otherwise(() => (
          <div className='grid h-full grid-cols-2 gap-1 p-1'>
            {A.mapWithIndex(A.take(templateItems, 4), (index, { id, type, Preview }) => (
              <div key={id} className='rounded-sm overflow-hidden relative' data-slot={type}>
                <Preview />
                <span className='absolute inset-0 size-full text-black/40 text-4xl font-semibold flex justify-center items-center'>
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    empty: "Empty template",
  },
  fr: {
    empty: "Template vide",
  },
  de: {
    empty: "Leerer Template",
  },
}
