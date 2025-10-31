import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { SeoEditStepDialog } from "@compo/seos"
import { Ui } from "@compo/ui"
import { G, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { usePagesService } from "../service.context"
import { PagesForm } from "./pages.form"

/**
 * PagesCreateDialog
 */
export const PagesCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.PageWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const [open, setOpen] = React.useState(false)
  const onOpenChange = (open: boolean) => {
    setOpen(open)
    props.onOpenChange?.(open)
  }
  const mergeOpen = G.isNotNullable(props.open) ? props.open : open
  return (
    <Ui.QuickDialogRoot open={mergeOpen} onOpenChange={onOpenChange}>
      {mergeOpen && <CreateContent mutate={props.mutate} />}
    </Ui.QuickDialogRoot>
  )
}

/**
 * CreateContent
 * This component is used to create a new page. It will navigate to the next step after creation.
 */
type Step = "page" | "seo"
const CreateContent: React.FC<{ mutate?: (value: Api.PageWithRelations) => Promise<void> }> = ({ mutate }) => {
  const { _ } = useTranslation(dictionary)
  const [step, setStep] = React.useState<Step>("page")
  const [page, setPage] = React.useState<Api.PageWithRelations | null>(null)
  const { routesTo } = usePagesService()
  const { close } = Ui.useQuickDialogContext()
  const [, navigate] = useLocation()
  const onSkip = () => {
    close()
    if (page) navigate(routesTo.pages.byId(page.id ?? ""))
  }
  const commonProps = { setPage, step, setStep, onSkip }
  if (page) {
    if (step === "seo") return <StepSeo {...commonProps} page={page} />
  }
  return <StepPage {...commonProps} page={null} mutate={mutate} />
}

/**
 * StepPage
 * This component is used to create a new page. It will navigate to the next step after creation.
 */
const StepPage: React.FC<PageProps & { mutate?: (value: Api.PageWithRelations) => Promise<void> }> = ({
  page,
  setPage,
  setStep,
  mutate,
}) => {
  const { _ } = useTranslation(dictionary)
  const { service, routesTo } = usePagesService()
  const [, navigate] = useLocation()
  const { close } = Ui.useQuickDialogContext()
  const initialValues = {
    state: "draft" as const,
    lock: false,
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      return match(await service.create(values))
        .with({ ok: true }, async ({ data: { page } }) => {
          await mutate?.(page)
          setPage(page)
          setStep("seo")
        })
        .otherwise(async ({ except }) => {
          if (except?.name === "E_VALIDATION_FAILURE") return _("validation")
          Ui.toast.error(_("failed"))
        })
    },
  })

  const handleSkip = async () => {
    match(await service.create(form.values))
      .with({ ok: true }, async ({ data: { page } }) => {
        await mutate?.(page)
        close()
        navigate(routesTo.pages.byId(page.id ?? ""))
      })
      .otherwise(async ({ except }) => {
        if (except?.name === "E_VALIDATION_FAILURE") form.setAssertive(_("validation"))
        else Ui.toast.error(_("failed"))
      })
  }

  return (
    <Ui.QuickDialogContent
      title={_("page.title")}
      description={_("page.description")}
      classNames={{ content: "sm:max-w-screen-sm" }}
      sticky
    >
      <Form.Root form={form} className='space-y-6'>
        <Form.Assertive />
        <PagesForm />
        <Ui.QuickDialogStickyFooter>
          <Form.Submit>
            <SaveAll aria-hidden />
            {_("page.submit")}
          </Form.Submit>
          <Ui.Button variant='outline' onClick={handleSkip}>
            {_("page.skip")}
            <ArrowRight aria-hidden />
          </Ui.Button>
        </Ui.QuickDialogStickyFooter>
      </Form.Root>
    </Ui.QuickDialogContent>
  )
}

/**
 * StepSeo
 * This component is used to update the SEO of the page.
 */
const StepSeo: React.FC<PageSafeProps> = ({ page, setPage, onSkip }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  return (
    <SeoEditStepDialog
      persistedId={page.id}
      seo={page.seo}
      service={service.id(page.id).seo}
      mutate={(seo: Api.Seo) => setPage({ ...page, seo })}
      title={_("seo.title")}
      description={_("seo.description")}
      onNext={onSkip}
      nextLabel={_("seo.next")}
    />
  )
}

/**
 * types
 */
type StepProps = {
  step: Step
  setStep: React.Dispatch<React.SetStateAction<Step>>
}
type PageProps = StepProps & {
  page: Api.PageWithRelations | null
  setPage: React.Dispatch<React.SetStateAction<Api.PageWithRelations | null>>
}
type PageSafeProps = StepProps & {
  page: Api.PageWithRelations
  setPage: React.Dispatch<React.SetStateAction<Api.PageWithRelations | null>>
  onSkip: () => void
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    failed: "Failed to create page",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    page: {
      title: "New page",
      description: "Fill in the basic details of your page.",
      submit: "Create page",
      skip: "Create and skip next steps",
    },
    seo: {
      title: "Search optimization",
      description: "Improve how your page appears in search results.",
      next: "Finish",
    },
  },
  fr: {
    failed: "Échec de la création de la page",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    page: {
      title: "Nouvelle page",
      description: "Remplissez les informations de base de la page.",
      submit: "Créer la page",
      skip: "Créer et ignorer les étapes suivantes",
    },
    seo: {
      title: "Optimisation pour les moteurs de recherche",
      description: "Améliorez l'apparence de votre page dans les résultats de recherche.",
      next: "Terminer",
    },
  },
  de: {
    failed: "Fehler beim Erstellen der Seite",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    page: {
      title: "Neue Seite",
      description: "Geben Sie die Grundinformationen Ihrer Seite ein.",
      submit: "Seite erstellen",
      skip: "Erstellen und nächste Schritte überspringen",
    },
    seo: {
      title: "Suchmaschinenoptimierung",
      description: "Verbessern Sie, wie Ihre Seite in Suchergebnissen erscheint.",
      next: "Fertigstellen",
    },
  },
}
