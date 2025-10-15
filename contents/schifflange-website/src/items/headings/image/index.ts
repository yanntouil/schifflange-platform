import { ItemSyncOverride } from "@compo/contents"
import { ClientItemExport } from "@contents/globals"
import { contentItem } from "./export"
import { Thumbnail } from "./thumbnail"

export default {
  export: contentItem,
  Thumbnail,
} satisfies ItemSyncOverride<ClientItemExport<"headings", "image">>
