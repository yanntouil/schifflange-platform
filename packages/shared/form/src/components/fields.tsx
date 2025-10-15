import { G } from "@compo/utils"
import React from "react"
import { FormA11y } from "."

/**
 * FormFieldGroup
 */
export type FormFieldsProps = {
  name?: string
  names?: string[]
  children: React.ReactNode
}

export const FormFields: React.FC<FormFieldsProps> = ({ name, names, children }) => {
  if (G.isNotNullable(name)) return <FormA11y.FieldGroup name={name}>{children}</FormA11y.FieldGroup>
  if (G.isNullable(names)) throw new Error("FormFields: no name or names provided")
  // recursively create field groups
  // Fonction récursive pour générer les FieldGroup
  const wrapFieldGroups = (remainingNames: string[], childContent: React.ReactNode): React.ReactNode => {
    if (remainingNames.length === 0) return childContent
    const [currentName, ...restNames] = remainingNames
    if (G.isNullable(currentName)) return childContent
    return (
      <FormA11y.FieldGroup name={currentName} key={currentName}>
        {wrapFieldGroups(restNames, childContent)}
      </FormA11y.FieldGroup>
    )
  }

  return <>{wrapFieldGroups(names, children)}</>
}
