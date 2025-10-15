import { Form, useForm } from "@compo/form"
import { useOnClickOutside } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { S } from "@compo/utils"
import React from "react"
import { useProject } from "../../project.context"

/**
 * Project location select
 */
export const LocationSelect: React.FC<{ className?: string }> = ({ className }) => {
  const { _ } = useTranslation(dictionary)
  const { updateLocation, swr } = useProject()
  const location = swr.project.location
  const [isEditing, setIsEditing] = React.useState(false)
  const form = useForm({
    values: { location },
    onSubmit: ({ values }) => {
      updateLocation(values.location)
      setIsEditing(false)
    },
  })
  const ref = React.useRef<HTMLInputElement>(null)
  useOnClickOutside(ref, () => form.submit())
  const edit = () => {
    setIsEditing(true)
    setTimeout(() => ref.current?.focus(), 100)
  }
  return (
    <>
      {isEditing ? (
        <Form.Root form={form} className='w-full'>
          <Form.Input ref={ref} placeholder={_("placeholder")} name='location' onBlur={() => form.submit()} />
        </Form.Root>
      ) : (
        <Ui.Button variant='ghost' className={className} onClick={edit}>
          {S.isEmpty(S.trim(location)) ? _("no-location") : location}
        </Ui.Button>
      )}
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    placeholder: "Enter a location",
    "no-location": "No location",
  },
  fr: {
    placeholder: "Entrez un emplacement",
    "no-location": "Aucun emplacement",
  },
  de: {
    placeholder: "Standort eingeben",
    "no-location": "Kein Standort",
  },
}
