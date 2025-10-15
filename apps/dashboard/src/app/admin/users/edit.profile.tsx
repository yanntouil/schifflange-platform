import { authStore } from "@/features/auth"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Api, Payload, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, F, T } from "@compo/utils"
import React from "react"
import { ProfileForm } from "./form.profile"

const { mutateMe } = authStore.actions

/**
 * dialog use to edit a user profile
 */
export const ProfileEditDialog: React.FC<Ui.QuickDialogProps<Api.Admin.User>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-2xl" }} sticky>
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * form to edit a user account
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.User>> = ({ mutate = F.identity, item: user, close }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const isSuperadmin = me.role === "superadmin"
  const isMe = user.id === me.id
  const notEnoughRights = !isSuperadmin && user.role === "superadmin"

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
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    disabled: notEnoughRights,
    onSubmit: async ({ values, setValues }) => {
      const payload: Payload.Admin.Users.UpdateProfile = {
        image: extractFormFilePayload(values.image),
        dob: values.dob ? T.formatISO(values.dob) : null,
        ...D.deleteKeys(values, ["image", "dob"]),
      }
      setIsLoading(true)
      const result = await service.admin.users.id(user.id).updateProfile(payload)
      setIsLoading(false)
      return match(result)
        .with({ ok: true }, ({ data }) => {
          close()
          mutate(data.user)
          if (isMe) mutateMe(data.user)
          Ui.toast.success(_(`success`))
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("error-validation-failure"))
            .otherwise(() => _("error-unknown"))
        )
    },
  })
  return (
    <Form.Root form={form} className="@container">
      <div className="space-y-8">
        <Form.Assertive />
        {notEnoughRights && (
          <Form.Alert variant="destructive">
            <p>{_("not-enough-rights")}</p>
          </Form.Alert>
        )}
        {isMe && (
          <Form.Alert variant="info">
            <p>{_("me-warning")}</p>
          </Form.Alert>
        )}
        <ProfileForm />
        <Form.Loading loading={isLoading} label={_("loading")} className="z-10" />
      </div>
      <Ui.QuickDialogStickyFooter>
        <Form.Submit>{_(`submit`)}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Edit user profile",
    description: "Update the details of the selected user profile.",
    "not-enough-rights": "You do not have the necessary rights to modify this user profile",
    "me-warning": "Warning, you are modifying your own profile",
    submit: "Update profile",
    success: "User profile updated successfully",
    loading: "Updating user profile",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
  },
  fr: {
    title: "Modifier le profil utilisateur",
    description: "Mettez à jour les informations du profil de l’utilisateur sélectionné.",
    "not-enough-rights": "Vous n'avez pas les droits nécessaires pour modifier ce profil utilisateur",
    "me-warning": "Attention, vous êtes en train de modifier votre propre profil",
    submit: "Mettre à jour le profil",
    success: "Le profil utilisateur a été mis à jour avec succès",
    loading: "Mise à jour du profil utilisateur",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
  },
  de: {
    title: "Benutzerprofil bearbeiten",
    description: "Aktualisieren Sie die Details des ausgewählten Benutzerprofils.",
    "not-enough-rights": "Sie haben nicht die erforderlichen Rechte, um dieses Benutzerprofil zu ändern",
    "me-warning": "Warnung, Sie ändern Ihr eigenes Profil",
    submit: "Profil aktualisieren",
    success: "Benutzerprofil erfolgreich aktualisiert",
    loading: "Aktualisieren des Benutzerprofils",
    "error-validation-failure": "Bitte überprüfen Sie die oben stehenden Felder.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
}
