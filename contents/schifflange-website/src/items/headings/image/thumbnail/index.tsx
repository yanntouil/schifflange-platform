import { ThumbnailItemComponent } from "@compo/contents"
import { useTranslation } from "@compo/localize"
import { client } from "@contents/globals"
import ThumbnailSvg from "./thumbnail.svg?react"

const item = client.getItem("headings", "image")

export const Thumbnail: ThumbnailItemComponent<typeof item.export> = () => {
  const { _ } = useTranslation(item.export.dictionary)
  return <ThumbnailSvg className='aspect-video max-h-full w-full max-w-full' aria-label={_("display-name")} />
}
