import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { makeColorsFromString, makeGoogleMapUrl, oneIsNotEmpty, placeholder, prettifyZip, S } from "@compo/utils"
import { Building2, Mail, Phone, Pin, RectangleEllipsis, User2, UserCircle } from "lucide-react"
import React from "react"
import { useUser } from "./context"

/**
 * UserProfile
 * display the profile of the user
 */
export const UserProfile: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { user } = useUser()
  const fullname = placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("fullname-placeholder"))
  const { street, zip, city, state, country } = user.profile.address
  const { position, company, phones, emails, extras } = user.profile

  const { scheme } = Ui.useTheme()
  const colors = makeColorsFromString(user.id)
  const style = {
    "--avatar-color-1": scheme === "dark" ? colors[1] : colors[0],
    "--avatar-color-2": scheme === "dark" ? colors[0] : colors[1],
  } as React.CSSProperties

  return (
    <Ui.Card.Root className={cx(user.profile.image && "mt-16")}>
      {user.profile.image && (
        <div className="relative flex w-full justify-center" style={style}>
          <Ui.Image
            src={service.getImageUrl(user.profile.image, "preview") as string}
            alt={fullname}
            classNames={{
              wrapper: "size-32 -mt-16 rounded-full bg-card p-2 border-t border-border shadow-sm shadow-primary/25",
              image: "size-full rounded-full bg-[var(--avatar-color-1)] object-cover",
              fallback: "size-full rounded-full bg-[var(--avatar-color-1)] text-[var(--avatar-color-2)]",
            }}
          >
            <User2 aria-hidden className="size-12 stroke-[1]" />
          </Ui.Image>
        </div>
      )}
      <Ui.Card.Header>
        <Ui.Card.Title>{_("profile-title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("profile-description")}</Ui.Card.Description>
      </Ui.Card.Header>

      <Ui.Card.Content>
        <Dashboard.Field.Root variant="default" divider>
          <Dashboard.Field.Item name={_("profile-fullname")} icon={<UserCircle aria-hidden />} value={fullname} />
          {oneIsNotEmpty(position, company) && (
            <Dashboard.Field.Item
              name={_("profile-company")}
              icon={<Building2 aria-hidden />}
              value={`${position ? `${position}  -  ` : ""}${company}`}
            />
          )}
          {oneIsNotEmpty(street, zip, city, state, country) && (
            <Dashboard.Field.Item name={_("profile-address")} icon={<Pin aria-hidden />}>
              <a
                href={makeGoogleMapUrl(user.profile.address)}
                rel="nofollow noopener noreferrer"
                className={variants.link({ className: "block" })}
              >
                {street}
                {oneIsNotEmpty(zip, city, state) && <br />}
                {S.trim(`${prettifyZip(zip)} ${city}${state ? `, ${state}` : ""}`)}
                {oneIsNotEmpty(country) && <br />}
                {country}
              </a>
            </Dashboard.Field.Item>
          )}
          <Dashboard.Field.Extra
            fields={phones}
            icon={<Phone aria-hidden />}
            wrapper={(value) => (
              <a href={`tel:${value}`} rel="nofollow noopener noreferrer" className={variants.link()}>
                {value}
              </a>
            )}
          />
          <Dashboard.Field.Extra
            fields={emails}
            icon={<Mail aria-hidden />}
            wrapper={(value) => (
              <a href={`mailto:${value}`} rel="nofollow noopener noreferrer" className={variants.link()}>
                {value}
              </a>
            )}
          />
          <Dashboard.Field.Extra fields={extras} icon={<RectangleEllipsis aria-hidden />} />
        </Dashboard.Field.Root>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "fullname-placeholder": "Utilisateur anonyme",
    "profile-title": "Information relative au profil",
    "profile-description": "Ces informations sont utilisées pour la gestion de l'utilisateur.",
    "profile-fullname": "Nom complet",
    "profile-company": "Entreprise",
    "profile-address": "Adresse",
  },
  en: {
    "fullname-placeholder": "Anonymous user",
    "profile-title": "Profile information",
    "profile-description": "These informations are used for the management of the user.",
    "profile-fullname": "Fullname",
    "profile-company": "Company",
    "profile-address": "Address",
  },
  de: {
    "fullname-placeholder": "Anonymer Benutzer",
    "profile-title": "Profilinformationen",
    "profile-description": "Diese Informationen werden für die Benutzerverwaltung verwendet.",
    "profile-fullname": "Vollständiger Name",
    "profile-company": "Unternehmen",
    "profile-address": "Adresse",
  },
}
