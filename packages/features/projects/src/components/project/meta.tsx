import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Folder, MapPin, TagIcon } from "lucide-react"
import React from "react"
import { useProject } from "../../project.context"
import { CategorySelect } from "./select-category"
import { LocationSelect } from "./select-location"
import { TagSelect } from "./select-tag"

/**
 * Meta
 * display the meta data of the project
 */
export const Meta: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useProject()
  return (
    <Ui.CollapsibleCard.Root id={swr.project.id}>
      <Ui.CollapsibleCard.Header>
        <Ui.CollapsibleCard.Title>{_("title")}</Ui.CollapsibleCard.Title>
        <Ui.CollapsibleCard.Aside>
          {/* <Ui.Tooltip.Quick tooltip={_("edit")} side='left' asChild>
            <Ui.Button variant='ghost' size='xs' icon onClick={edit}>
              <Edit aria-hidden />
              <Ui.SrOnly>{_("edit")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick> */}
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content>
        <div className='flex flex-col gap-2 px-6 pb-4 max-w-xl'>
          <Dashboard.Field.Root stretch className='[&_svg]:shrink-0 gap-0'>
            <Dashboard.Field.Item
              icon={<MapPin aria-hidden />}
              name={_("location-label")}
              classNames={{ li: "items-center py-0", value: "-ml-2" }}
            >
              <LocationSelect />
            </Dashboard.Field.Item>
            <Dashboard.Field.Item
              icon={<Folder aria-hidden />}
              name={_("category-label")}
              classNames={{ li: "items-center py-0", value: "-ml-2" }}
            >
              <CategorySelect />
            </Dashboard.Field.Item>
            <Dashboard.Field.Item
              icon={<TagIcon aria-hidden />}
              name={_("tag-label")}
              classNames={{ li: "items-center py-0", value: "-ml-2" }}
            >
              <TagSelect />
            </Dashboard.Field.Item>
          </Dashboard.Field.Root>
        </div>
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Meta information",
    "location-label": "Location",
    "category-label": "Category",
    "tag-label": "Tag",
  },
  fr: {
    title: "Informations méta",
    "location-label": "Emplacement",
    "category-label": "Catégorie",
    "tag-label": "Tag",
  },
  de: {
    title: "Metainformationen",
    "location-label": "Standort",
    "category-label": "Kategorie",
    "tag-label": "Tag",
  },
}
