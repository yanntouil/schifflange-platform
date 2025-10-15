import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { ImageDownIcon } from "lucide-react"
import React from "react"

/**
 * display user profile form to update user profile
 */
export const ProfileForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-[16rem_1fr]">
        <div>
          <Form.Image name="logo" aspect="aspect-square">
            <ImageDownIcon className="text-muted-foreground size-10 stroke-[1]" aria-hidden />
          </Form.Image>
        </div>
        <div className="space-y-6"></div>
      </div>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    //
  },
  fr: {
    //
  },
  de: {
    //
  },
}
