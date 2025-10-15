import { ItemSync } from "@compo/contents"
import { contentItem } from "./export"
import { createForm } from "./form"
import { Thumbnail } from "./thumbnail"

export default {
  export: contentItem,
  createForm,
  Thumbnail,
} satisfies ItemSync<typeof contentItem>