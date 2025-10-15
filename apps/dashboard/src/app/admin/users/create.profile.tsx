import { Api, Payload, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, T } from "@compo/utils"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import adminUsersIdRouteTo from "./[userId]"
import { ProfileForm } from "./form.profile"

/**
 * Admin users update profile form
 */
export const Profile: React.FC<{ user: Api.Admin.User }> = ({ user }) => {
  const { _ } = useTranslation(dictionary)

  const { close } = Ui.useQuickDialogContext()

  const initialValues = {
    lastname: user.profile.lastname,
    firstname: user.profile.firstname,
    company: user.profile.company,
    position: user.profile.position,
    emails: user.profile.emails,
    phones: user.profile.phones,
    extras: user.profile.extras,
    address: user.profile.address,
    dob: user.profile.dob,
    image: makeFormFileValue(service.getImageUrl(user.profile.image, "preview")),
  }

  const [isLoading, setIsLoading] = React.useState(false)
  const [, navigate] = useLocation()

  const onSkip = () => {
    close()
    navigate(adminUsersIdRouteTo(user.id))
  }

  const form = useForm({
    allowSubmitAttempt: true,
    allowErrorSubmit: true,
    values: initialValues,

    onSubmit: async ({ values, isValid }) => {
      if (!isValid) return _("error-validation-failure")

      const payload: Payload.Admin.Users.UpdateProfile = {
        image: extractFormFilePayload(values.image),
        dob: values.dob ? T.formatISO(values.dob) : null,
        ...D.deleteKeys(values, ["image", "dob"]),
      }

      setIsLoading(true)
      const result = await service.admin.users.id(user.id).updateProfile(payload)
      setIsLoading(false)
      return match(result)
        .with({ ok: true }, () => {
          close()
          navigate(adminUsersIdRouteTo(user.id))
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("error-validation-failure"))
            .otherwise(() => _("error-unknown"))
        )
    },
  })

  return (
    <Ui.QuickDialogContent title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-screen-md" }} sticky>
      <Form.Root form={form} className="@container space-y-6">
        <Form.Assertive />
        <ProfileForm />
        <Ui.QuickDialogStickyFooter>
          <Ui.Button type="submit">
            <SaveAll aria-hidden />
            {_("update")}
          </Ui.Button>
          <Ui.Button variant="outline" onClick={onSkip}>
            {_("skip")}
            <ArrowRight aria-hidden />
          </Ui.Button>
        </Ui.QuickDialogStickyFooter>
        <Form.Loading loading={isLoading} label={_("loading")} />
      </Form.Root>
    </Ui.QuickDialogContent>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Profil de l'utilisateur",
    description: "Configurez les informations du profil de l'utilisateur.",
    update: "Ajouter le profil",
    skip: "Passer cette étape",
    loading: "Mise à jour du profil en cours",
  },
  en: {
    title: "Create a new account",
    description: "Set up the user’s access and permissions to get started quickly.",
    update: "Save changes",
    skip: "Skip this step",
    loading: "Updating the profile is in progress",
  },
  de: {
    title: "Benutzerprofil erstellen",
    description: "Konfigurieren Sie die Informationen des Benutzerprofils.",
    update: "Profil speichern",
    skip: "Diese Schritt überspringen",
    loading: "Aktualisieren des Profils",
  },
}
