import { ThumbnailItemComponent } from "@compo/contents"
import { useTranslation } from "@compo/localize"
import { contentItem } from "../export"
import ThumbnailSvg from "./thumbnail.svg?react"

export const Thumbnail: ThumbnailItemComponent<typeof contentItem> = () => {
  const { _ } = useTranslation(contentItem.dictionary)
  return <ThumbnailSvg className='aspect-video max-h-full w-full max-w-full' aria-label={_("display-name")} />
}
