import React from "react"
import stableHash from "stable-hash"

/**
 * useFormTouched
 * compare form touched values to initial values and set touched state
 */
export const useFormTouched = <V extends Record<string, unknown>>(form: { values: V }, initialValues: V) => {
  const [isTouched, setIsTouched] = React.useState(false)
  const formHash = React.useMemo(() => stableHash(form.values), [form.values])
  const initialHash = React.useMemo(() => stableHash(initialValues), [initialValues])
  React.useEffect(() => {
    if (isTouched) return
    if (formHash === initialHash) return
    setIsTouched(true)
  }, [formHash, initialHash, isTouched])
  return [isTouched, setIsTouched]
}

/**
 * useFormDirty
 * compare form values to initial values and update dirty state
 */
export const useFormDirty = <V extends Record<string, unknown>>(form: { values: V }, initialValues: V) => {
  const [isDirty, setIsDirty] = React.useState(false)
  const formHash = React.useMemo(() => stableHash(form.values), [form.values])
  const initialHash = React.useMemo(() => stableHash(initialValues), [initialValues])
  React.useEffect(() => {
    if (formHash === initialHash) setIsDirty(false)
    else setIsDirty(true)
  }, [formHash, initialHash, isDirty])
  return [isDirty, setIsDirty]
}
