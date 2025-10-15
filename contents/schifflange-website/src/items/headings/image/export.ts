import { ExportedItemOverride } from "@compo/contents"
import { ClientItemExport } from "@contents/globals"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItemOverride<ClientItemExport<"headings", "image">>
