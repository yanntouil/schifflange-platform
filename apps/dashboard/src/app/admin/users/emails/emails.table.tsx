import { Api, service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, D, placeholder, T } from "@compo/utils"
import { getCoreRowModel, Row, useReactTable } from "@tanstack/react-table"
import { CalendarPlus, Glasses, Mail, Repeat, TvMinimalPlay } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import adminUsersIdRouteTo from "../[userId]"
import { UserAvatar } from "../users.avatar"
import { StatusIcon } from "./emails.icons"
import { columns } from "./emails.table.columns"
import { emailsStore, useEmailsStore } from "./store"

/**
 * EmailsTable
 * display a table of emails with a menu and a checkbox (tanstack table)
 */
export const EmailsTable: React.FC<{ emails: Api.Admin.EmailLog[] }> = ({ emails }) => {
  const { _ } = useTranslation(dictionary)
  const columnSizing = Dashboard.useTableColumnSizing(useEmailsStore(D.prop("columnSizing")), emailsStore.actions.setColumnSizing)
  const table = useReactTable<DataItem>({
    data: emails,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: { columnSizing: columnSizing.state },
    onColumnSizingChange: columnSizing.onChange,
    defaultColumn: Dashboard.makeColumnSize(),
    initialState: {
      columnPinning: { right: ["metadata"] },
      columnSizing: columnSizing.initial,
    },
  })
  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => <Dashboard.Table.Row key={row.id} item={row.original.user} cells={row.getVisibleCells()} />}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
type DataItem = Api.Admin.EmailLog
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
export const ColumnStatus: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { status } = row.original
  return (
    <span className="inline-flex items-center gap-4 font-medium">
      <span className="bg-muted flex size-8 items-center justify-center rounded-md">
        <StatusIcon status={status} className="size-4" aria-hidden />
      </span>
      <Ui.Tooltip.Quick tooltip={status.toUpperCase()} className={variants.focusVisible({ className: "rounded" })}>
        {_(`status.${status}`)}
      </Ui.Tooltip.Quick>
    </span>
  )
}
export const ColumnEmail: React.FC<ColumnProps> = ({ row }) => {
  const { email } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <Mail className="size-4" aria-hidden />
      <span>{email}</span>
    </span>
  )
}
export const ColumnTemplate: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { template } = row.original
  return <span className="text-sm">{_(`template.${template}`, { defaultValue: template })}</span>
}
export const ColumnSubject: React.FC<ColumnProps> = ({ row }) => {
  const { subject } = row.original
  return <span className="truncate">{subject}</span>
}
export const ColumnRetryAttempts: React.FC<ColumnProps> = ({ row }) => {
  const { retryAttempts } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <Repeat className="size-4" aria-hidden />
      <span>{retryAttempts}</span>
    </span>
  )
}
export const ColumnCreatedBy: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { user } = row.original
  if (!user)
    return (
      <div className="inline-flex items-center gap-2">
        <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
          <Glasses className="size-4" aria-hidden />
        </span>
        <span className="truncate font-medium">{_("created-by-unknown")}</span>
      </div>
    )
  const { firstname, lastname } = user.profile
  const fullname = placeholder(`${firstname} ${lastname}`, _("created-by-placeholder"))
  return (
    <div className="inline-flex items-center gap-2">
      <UserAvatar user={user} size="size-8" />
      <div className="space-y-.5">
        <Link to={adminUsersIdRouteTo(user.id)} className={cxm("truncate font-medium", variants.link())}>
          {fullname}
        </Link>
        <div className="text-muted-foreground text-xs">{user.email}</div>
      </div>
    </div>
  )
}
export const ColumnCreatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { _, format } = useTranslation(dictionary)
  const { createdAt } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <CalendarPlus className="size-4" aria-hidden />
      <span>{format(T.parseISO(createdAt), "PPPpp")}</span>
    </span>
  )
}
export const ColumnMetadata: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { id } = row.original
  const [open, props] = Ui.useQuickDialog()
  return (
    <>
      <span className="flex shrink-0 items-center justify-end">
        <Ui.Button variant="outline" size="sm" className="inline-flex items-center gap-2" onClick={() => open(true)}>
          <TvMinimalPlay aria-hidden />
          <Ui.SrOnly>{_("preview-label")}</Ui.SrOnly>
        </Ui.Button>
      </span>
      <Ui.QuickDialog {...props} classNames={{ content: "sm:max-w-xl", wrapper: "p-0 h-[80vh]" }}>
        <PreviewContent id={id} />
      </Ui.QuickDialog>
    </>
  )
}
const PreviewContent: React.FC<{ id: string }> = ({ id }) => {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    const loadPreview = async () => {
      if (preview || isLoading) return
      setIsLoading(true)
      const response = await service.admin.emailLogs.id(id).preview()
      if (response.ok) {
        setPreview(response.data.preview)
      }
      setIsLoading(false)
    }
    loadPreview()
  }, [id, isLoading, preview])
  if (isLoading) {
    return <div className="p-4 text-center">Loading preview...</div>
  }
  if (preview) {
    return <iframe srcDoc={preview} className="h-full w-full border-0" title="Email preview" />
  }
  return <div className="p-4 text-center">No preview available</div>
}

/**
 * translations
 */
const dictionary = {
  en: {
    "status-label": "Status",
    "email-label": "Email address",
    "template-label": "Template",
    template: {
      authRegistration: "Registration",
      authTriedToRegister: "Attempt to register",
      authPasswordReset: "Password reset",
      authEmailChangeVerification: "Email change verification",
      accountActivated: "Account activated by admin",
      accountDisabled: "Account suspended by admin",
      accountDeleted: "Account deleted by admin",
      accountPending: "Account to pending by admin",
      accountPasswordReset: "Password reset by admin",
      accountEmailChange: "Email change by admin",
      accountWelcome: "Welcome message by admin",
      accountAuthentication: "Account authentication by admin",
      workspaceInvitation: "Workspace invitation",
      workspaceInvitationSignUp: "Workspace invitation welcome",
    },
    "subject-label": "Subject",
    "retry-attempts-label": "Retry attempts",
    "created-by-label": "Related user",
    "created-by-unknown": "Unknown user",
    "created-by-placeholder": "Unnamed user",
    "created-at-label": "Related date",
    "preview-label": "Preview email",
    status: {
      queued: "Queued",
      sent: "Sent",
      failed: "Failed",
    },
  },
  fr: {
    "status-label": "Statut",
    "email-label": "Adresse email",
    "template-label": "Modèle",
    template: {
      authRegistration: "Inscription",
      authTriedToRegister: "Tentative d'inscription",
      authPasswordReset: "Réinitialisation de mot de passe",
      authEmailChangeVerification: "Vérification de changement d'email",
      accountActivated: "Compte activé par admin",
      accountDisabled: "Compte suspendu par admin",
      accountDeleted: "Compte supprimé par admin",
      accountPending: "Compte en attente par admin",
      accountPasswordReset: "Réinitialisation de mot de passe par admin",
      accountEmailChange: "Changement d'email par admin",
      accountWelcome: "Message de bienvenue par admin",
      accountAuthentication: "Account authentication by admin",
      workspaceInvitation: "Invitation à un espace de travail",
      workspaceInvitationSignUp: "Message de bienvenue pour l'invitation à un espace de travail",
    },
    "subject-label": "Sujet",
    "retry-attempts-label": "Tentatives de renvoi",
    "created-by-label": "Utilisateur concerné",
    "created-by-unknown": "Utilisateur inconnu",
    "created-by-placeholder": "Utilisateur anonyme",
    "created-at-label": "Date relative",
    "preview-label": "Aperçu de l'email",
    status: {
      queued: "En attente",
      sent: "Envoyé",
      failed: "Échoué",
    },
  },
  de: {
    "status-label": "Status",
    "email-label": "E-Mail-Adresse",
    "template-label": "Vorlage",
    template: {
      authRegistration: "Registrierung",
      authTriedToRegister: "Versuch zu registrieren",
      authPasswordReset: "Passwort zurücksetzen",
      authEmailChangeVerification: "E-Mail-Änderung verifizieren",
      accountActivated: "Konto vom Admin aktiviert",
      accountDisabled: "Konto vom Admin gesperrt",
      accountDeleted: "Konto vom Admin gelöscht",
      accountPending: "Konto vom Admin auf ausstehend gesetzt",
      accountPasswordReset: "Passwort vom Admin zurückgesetzt",
      accountEmailChange: "E-Mail vom Admin geändert",
      accountWelcome: "Willkommensnachricht vom Admin",
      accountAuthentication: "Kontoauthentifizierung vom Admin",
      workspaceInvitation: "Arbeitsbereichseinladung",
      workspaceInvitationSignUp: "Willkommensnachricht zur Arbeitsbereichseinladung",
    },
    "subject-label": "Betreff",
    "retry-attempts-label": "Wiederholungsversuche",
    "created-by-label": "Betroffener Benutzer",
    "created-by-unknown": "Unbekannter Benutzer",
    "created-by-placeholder": "Unbenannter Benutzer",
    "created-at-label": "Betroffenes Datum",
    "preview-label": "E-Mail-Vorschau",
    status: {
      queued: "In Warteschlange",
      sent: "Gesendet",
      failed: "Fehlgeschlagen",
    },
  },
}
