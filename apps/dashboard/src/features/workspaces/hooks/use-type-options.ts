import { useTranslation } from "@compo/localize"
import { A } from "@mobily/ts-belt"
import React from "react"
import { dictionary, workspaceTypes } from "../utils"

/**
 * This hook is used to get the type options for the workspace type select
 */
export const useTypeOptions = () => {
  const { _ } = useTranslation(dictionary)
  const typeOptions = React.useMemo(() => A.map([...workspaceTypes], (type) => ({ label: _(type), value: type })), [_])
  return typeOptions
}
