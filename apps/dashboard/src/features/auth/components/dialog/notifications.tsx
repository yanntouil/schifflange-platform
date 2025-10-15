import { Notifications } from "@/features/notifications"
import { useTranslation } from "@compo/localize"
import React from "react"
import { AuthDialogContent } from "./content"
import { AuthDialogHeader } from "./header"

export type AuthDialogTabNotifications = {
  type: "notifications"
  params: {}
}

/**
 * dialog notifications
 * this component is used to display the notifications tab in the auth dialog
 */
export const AuthDialogNotifications: React.FC<{ tab: AuthDialogTabNotifications }> = ({ tab }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <AuthDialogHeader title={_("title")} description={_("description")} sticky />
      <AuthDialogContent>
        <Notifications />
      </AuthDialogContent>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Notifications",
    description: "Manage your notifications settings and preferences.",
  },
  fr: {
    title: "Notifications",
    description: "Gérer vos paramètres et préférences de notifications.",
  },
  de: {
    title: "Benachrichtigungen",
    description: "Verwalten Sie Ihre Benachrichtigungseinstellungen und -präferenzen.",
  },
}
