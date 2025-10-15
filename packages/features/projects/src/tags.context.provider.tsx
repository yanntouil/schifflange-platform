import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { TagsCreateDialog } from "./components/tags.create"
import { TagsEditDialog } from "./components/tags.edit"
import { SWRTags } from "./swr"
import { TagsContext } from "./tags.context"
import { useManageTag } from "./tags.context.actions"

/**
 * TagsProvider
 */
type TagsProviderProps = {
  swr: SWRTags
  children: React.ReactNode
}

export const TagsProvider: React.FC<TagsProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.ProjectTag>()

  useKeepOnly(swr.tags, selectable.keepOnly)

  const [manageTag, manageTagProps] = useManageTag(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageTag,
      swr,
    }),
    [contextProps, manageTag, swr]
  )
  return (
    <TagsContext.Provider key={contextId} value={value}>
      {children}
      <ManageTag {...manageTagProps} key={`${contextId}-manageTag`} />
    </TagsContext.Provider>
  )
}

/**
 * ManageCategory
 */
export type ManageTagProps = ReturnType<typeof useManageTag>[1]
const ManageTag: React.FC<ManageTagProps> = ({
  createTagProps,
  editTagProps,
  confirmDeleteTagProps,
  confirmDeleteSelectionTagProps,
}) => {
  return (
    <>
      <TagsCreateDialog {...createTagProps} />
      <TagsEditDialog {...editTagProps} />
      <Ui.Confirm {...confirmDeleteTagProps} />
      <Ui.Confirm {...confirmDeleteSelectionTagProps} />
    </>
  )
}
