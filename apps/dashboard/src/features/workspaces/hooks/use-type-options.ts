import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * This hook is used to get the type options for the workspace type select
 */
export const useTypeOptions = () => {
  const { _ } = useTranslation(dictionary)
  const typeOptions = React.useMemo(
    () => [
      { label: _("lumiq"), value: "lumiq" },
      { label: _("type-a"), value: "type-a" },
      { label: _("type-b"), value: "type-b" },
      { label: _("type-c"), value: "type-c" },
    ],
    [_]
  )
  return typeOptions
}

/**
 * translations
 */
const dictionary = {
  en: {
    lumiq: "LumiQ",
    "type-a": "Type A",
    "type-b": "Type B",
    "type-c": "Type C",
  },
  fr: {
    lumiq: "LumiQ",
    "type-a": "Type A",
    "type-b": "Type B",
    "type-c": "Type C",
  },
  de: {
    lumiq: "LumiQ",
    "type-a": "Typ A",
    "type-b": "Typ B",
    "type-c": "Typ C",
  },
}
