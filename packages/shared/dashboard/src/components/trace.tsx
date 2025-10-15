import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { G, cxm } from "@compo/utils"
import { AlertTriangle, CheckIcon, ChevronsUpDown, RefreshCcw, TimerReset } from "lucide-react"
import React from "react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import ReactLinkify from "react-linkify"

/**
 * Error
 * display the error boundary
 */

export type ErrorProps = React.ComponentProps<typeof ErrorBoundary>
export const Error: React.FC<ErrorProps> = ({ ...props }) => {
  return <ErrorBoundary {...props} />
}

/**
 * Trace
 */
type Props = { title?: string; description?: string } & Omit<
  React.ComponentProps<typeof Ui.Collapsible.Root>,
  "children" | "open" | "onOpenChange"
> &
  FallbackProps
export const Trace: React.FC<Props> = ({ error, resetErrorBoundary, title, description, className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const [openTrace, setOpenTrace] = React.useState(true)

  const reloadPage = () => {
    window.location.reload()
  }
  const resetError = () => {
    resetErrorBoundary()
  }
  const [reported, setReported] = React.useState(false)
  const reportError = () => {
    setReported(true)
    Ui.toast.info(_("toast"))
  }

  const consoleCx = {
    button: "rounded-lg text-[#c5c5c5] hover:bg-[#383838] hover:text-[#c5c5c5]",
    tooltip: "bg-[#2c2b2b] text-[#c5c5c5] border border-[#262626] rounded-lg",
  }
  return (
    <Ui.Collapsible.Root
      {...props}
      open={openTrace}
      onOpenChange={setOpenTrace}
      className={cxm("space-y-4 p-6 text-foreground", className)}
    >
      <div className='space-y-2'>
        <h3 className='text-lg font-medium text-red-800'>{title || _("render-error-title")}</h3>
        <p className='max-w-lg text-sm text-muted-foreground'>{description || _("render-error-description")}</p>
      </div>
      <div className='flex justify-start gap-2'>
        {G.isString(error.stack) && (
          <Ui.Collapsible.Trigger asChild>
            <Ui.Button variant='outline' size='xs'>
              {openTrace ? _("close-trace") : _("open-trace")}
              <ChevronsUpDown aria-hidden className='!size-3.5 shrink-0 opacity-50' />
            </Ui.Button>
          </Ui.Collapsible.Trigger>
        )}
        <Ui.Button variant='outline' size='xs' onClick={reportError} disabled={reported}>
          {reported ? <CheckIcon aria-hidden /> : <AlertTriangle aria-hidden />}
          {_("report-error")}
        </Ui.Button>
      </div>
      {G.isString(error.stack) && (
        <Ui.Collapsible.Content className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
          <div className='relative rounded-md border border-[#262626] bg-[#1d1d1d] p-4'>
            <div className='absolute right-1 top-1 flex items-center gap-1'>
              <Ui.Tooltip.Quick
                tooltip={_("reload-page")}
                side='left'
                asChild
                classNames={{ content: consoleCx.tooltip }}
              >
                <Ui.Button variant='ghost' size='xs' onClick={reloadPage} className={consoleCx.button}>
                  <Ui.SrOnly>{_("reload-page")}</Ui.SrOnly>
                  <RefreshCcw aria-hidden />
                </Ui.Button>
              </Ui.Tooltip.Quick>
              <Ui.Tooltip.Quick
                tooltip={_("reset-error")}
                side='left'
                asChild
                classNames={{ content: consoleCx.tooltip }}
              >
                <Ui.Button variant='ghost' size='xs' onClick={resetError} className={consoleCx.button}>
                  <Ui.SrOnly>{_("reset-error")}</Ui.SrOnly>
                  <TimerReset aria-hidden />
                </Ui.Button>
              </Ui.Tooltip.Quick>
              <Ui.Tooltip.Quick
                tooltip={_("copy-error")}
                side='left'
                asChild
                classNames={{ content: consoleCx.tooltip }}
              >
                <Ui.CopyToClipboardButton value={error.stack.toString()} size='xs' className={consoleCx.button} />
              </Ui.Tooltip.Quick>
            </div>
            <p
              className={cxm(
                "w-full max-w-full overflow-x-auto whitespace-pre pt-4 text-xs/relaxed font-normal text-[#c5c5c5] [&_a]:font-medium [&_a]:italic [&_a]:text-[#64b2f5]",
                variants.scrollbar({ variant: "thin" })
              )}
            >
              <ReactLinkify>{error.stack}</ReactLinkify>
            </p>
          </div>
        </Ui.Collapsible.Content>
      )}
    </Ui.Collapsible.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Un erreur est survenue",
    description:
      "Une erreur est survenue lors du rendu de ce contenu. Vous pouvez voir le message d'erreur ci-dessous, essayer de le réparer ou le signaler à l'assistance.",
    toast: "L'erreur a été signalée",
    "open-trace": "Afficher l'erreur",
    "close-trace": "Masquer l'erreur",
    "reload-page": "Recharger la page",
    "reset-error": "Réinitialiser le rendu",
    "copy-error": "Copier l'erreur",
    "report-error": "Signaler l'erreur",
  },
  en: {
    title: "An error occurred",
    description:
      "An error occurred while rendering this content. You can see the error message below, try to fix it or report it to support.",
    toast: "The error has been reported",
    "open-trace": "Show error",
    "close-trace": "Hide error",
    "reload-page": "Reload page",
    "reset-error": "Reset error",
    "copy-error": "Copy error",
    "report-error": "Report error",
  },
  de: {
    title: "Ein Fehler ist aufgetreten",
    description:
      "Ein Fehler ist aufgetreten, während dieser Inhalt gerendert wurde. Sie können den Fehler unten sehen, versuchen, ihn zu beheben oder ihn an Support melden.",
    toast: "Der Fehler wurde gemeldet",
    "open-trace": "Fehler anzeigen",
    "close-trace": "Fehler ausblenden",
    "reload-page": "Seite neu laden",
    "reset-error": "Fehler zurücksetzen",
    "copy-error": "Fehler kopieren",
    "report-error": "Fehler melden",
  },
}
