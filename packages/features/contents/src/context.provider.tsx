import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { CreateDialog } from "./components/dialogs/create"
import { EditDialog } from "./components/dialogs/edit"
import { ContentContext, ContentContextType, ContentItems, ContentMutationsHelpers } from "./context"
import { useManageItems } from "./context.actions"

type Props = {
  persistedId: string
  makePreviewItemUrl: ContentContextType["makePreviewItemUrl"]
  service: Api.ContentService
  content: Api.Content
  items: ContentItems
  swr: ContentMutationsHelpers
  children: React.ReactNode
  disabledTemplates: boolean
}

export const ContentProvider: React.FC<Props> = ({ children, ...props }) => {
  const { service, content, swr } = props
  const contextId = React.useId()
  const [manageItems, manageItemsProps] = useManageItems(service, content, swr)
  return (
    <ContentContext.Provider
      value={{
        contextId,
        ...manageItems,
        ...props,
      }}
    >
      {children}
      <EditDialog {...manageItemsProps.editItemProps} />
      <CreateDialog {...manageItemsProps.createItemProps} />
      <Ui.Confirm {...manageItemsProps.confirmDeleteProps} />
    </ContentContext.Provider>
  )
}
