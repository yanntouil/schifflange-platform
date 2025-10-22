import { FormSelectOption } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { A } from "@mobily/ts-belt"
import { Api } from "@services/dashboard"
import React from "react"

/**
 * useTypeOptions
 * return a list of options for the organisation types usable in a select input
 */
export const useTypeOptions = (none: boolean = false) => {
  const { _ } = useTranslation(dictionary)
  const options: FormSelectOption[] = React.useMemo(
    () => A.map(organisationTypes, (type) => ({ label: _(type), value: type })),
    [_]
  )
  return options
}
export const organisationTypes: Api.OrganisationType[] = [
  "municipality",
  "service",
  "association",
  "commission",
  "company",
  "other",
]
export const organisationTypeDefault: Api.OrganisationType = "other"

const dictionary = {
  fr: {
    municipality: "Commune",
    service: "Service communal",
    association: "Association",
    commission: "Commission",
    company: "Entreprise",
    other: "Autre (non défini)",
  },
  en: {
    municipality: "Municipality",
    service: "Service",
    association: "Association",
    commission: "Commission",
    company: "Company",
    other: "Other (undefined)",
  },
  de: {
    municipality: "Gemeinde",
    service: "Dienst",
    association: "Verein",
    commission: "Kommission",
    company: "Unternehmen",
    other: "Andere (undefiniert)",
  },
}
