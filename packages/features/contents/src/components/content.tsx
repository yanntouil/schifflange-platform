import React from "react"
import { ContentContextType } from "../context"
import { ContentProvider } from "../context.provider"
import { Collection } from "./collection"
import { Preview } from "./preview"

/**
 * Content
 * display the list of content items
 */
type Props = {
  persistedId: ContentContextType["persistedId"]
  makePreviewItemUrl: ContentContextType["makePreviewItemUrl"]
  service: ContentContextType["service"]
  content: ContentContextType["content"]
  items: ContentContextType["items"]
  swr: ContentContextType["swr"]
  disabledTemplates?: ContentContextType["disabledTemplates"]
}

export const Content: React.FC<Props> = ({ disabledTemplates = false, ...props }) => {
  return (
    <ContentProvider {...props} disabledTemplates={disabledTemplates}>
      <Preview />
      <Collection />
    </ContentProvider>
  )
}
