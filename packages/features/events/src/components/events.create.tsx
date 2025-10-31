import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { PublicationEditStepDialog } from "@compo/publications"
import { ScheduleEditStepDialog } from "@compo/schedules"
import { SeoEditStepDialog } from "@compo/seos"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { G, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { useEventsService } from "../service.context"
import { EventsForm } from "./events.form"

/**
 * EventsCreateDialog
 */
export const EventsCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.EventWithRelations>> = ({ item, ...props }) => {
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
 * This component is used to create a new event. It will navigate to the next step after creation.
 */
type Step = "event" | "seo" | "schedule" | "publication"
const CreateContent: React.FC<{ mutate?: (value: Api.EventWithRelations) => Promise<void> }> = ({ mutate }) => {
  const { _ } = useTranslation(dictionary)
  const [step, setStep] = React.useState<Step>("event")
  const [event, setEvent] = React.useState<Api.EventWithRelations | null>(null)
  const { routesTo } = useEventsService()
  const { close } = Ui.useQuickDialogContext()
  const [, navigate] = useLocation()
  const onSkip = () => {
    close()
    if (event) navigate(routesTo.events.byId(event.id ?? ""))
  }
  const commonProps = { setEvent, step, setStep, onSkip }
  if (event) {
    if (step === "seo") return <StepSeo {...commonProps} event={event} />
    if (step === "schedule") return <StepSchedule {...commonProps} event={event} />
    if (step === "publication") return <StepPublication {...commonProps} event={event} />
  }
  return <StepEvent {...commonProps} event={null} mutate={mutate} />
}

/**
 * StepEvent
 * This component is used to create a new event. It will navigate to the next step after creation.
 */
const StepEvent: React.FC<EventProps & { mutate?: (value: Api.EventWithRelations) => Promise<void> }> = ({
  event,
  setEvent,
  setStep,
  mutate,
}) => {
  const { _ } = useTranslation(dictionary)
  const { close } = Ui.useQuickDialogContext()
  const { service, routesTo } = useEventsService()
  const [, navigate] = useLocation()
  const initialValues = {
    props: {} as Record<string, unknown>,
    state: "draft" as const,
    categoryIds: [] as string[],
    translations: useFormTranslatable([] as Api.EventTranslation[], servicePlaceholder.event),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
      }
      return match(await service.create(payload))
        .with({ ok: true }, async ({ data: { event } }) => {
          await mutate?.(event)
          setEvent(event)
          setStep("seo")
        })
        .otherwise(async ({ except }) => {
          if (except?.name === "E_VALIDATION_FAILURE") return _("validation")
          Ui.toast.error(_("failed"))
        })
    },
  })

  const handleSkip = async () => {
    const payload = {
      ...form.values,
    }
    match(await service.create(payload))
      .with({ ok: true }, async ({ data: { event } }) => {
        await mutate?.(event)
        close()
        navigate(routesTo.events.byId(event.id ?? ""))
      })
      .otherwise(async ({ except }) => {
        if (except?.name === "E_VALIDATION_FAILURE") form.setAssertive(_("validation"))
        else Ui.toast.error(_("failed"))
      })
  }

  return (
    <Ui.QuickDialogContent
      title={_("event.title")}
      description={_("event.description")}
      classNames={{ content: "sm:max-w-screen-sm" }}
      sticky
    >
      <Form.Root form={form} className='space-y-6'>
        <Form.Assertive />
        <EventsForm />
        <Ui.QuickDialogStickyFooter>
          <Form.Submit>
            <SaveAll aria-hidden />
            {_("event.submit")}
          </Form.Submit>
          <Ui.Button variant='outline' onClick={handleSkip}>
            {_("event.skip")}
            <ArrowRight aria-hidden />
          </Ui.Button>
        </Ui.QuickDialogStickyFooter>
      </Form.Root>
    </Ui.QuickDialogContent>
  )
}

/**
 * StepSeo
 * This component is used to update the SEO of the event.
 */
const StepSeo: React.FC<EventSafeProps> = ({ event, setEvent, setStep, onSkip }) => {
  const { _ } = useTranslation(dictionary)
  const { service, routesTo } = useEventsService()
  return (
    <SeoEditStepDialog
      persistedId={event.id}
      seo={event.seo}
      service={service.id(event.id).seo}
      mutate={(seo: Api.Seo) => setEvent({ ...event, seo })}
      title={_("seo.title")}
      description={_("seo.description")}
      onNext={() => setStep("schedule")}
      nextLabel={_("seo.next")}
      onSkip={onSkip}
      skipLabel={_("seo.skip")}
    />
  )
}

/**
 * StepSchedule
 * This component is used to update the schedule of the event.
 */
const StepSchedule: React.FC<EventSafeProps> = ({ event, setEvent, setStep, onSkip }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
  return (
    <ScheduleEditStepDialog
      persistedId={event.id}
      schedule={event.schedule}
      service={service.id(event.id).schedule}
      mutate={(schedule: Api.Schedule) => setEvent({ ...event, schedule })}
      title={_("schedule.title")}
      description={_("schedule.description")}
      onNext={() => setStep("publication")}
      nextLabel={_("schedule.next")}
      onSkip={onSkip}
      skipLabel={_("schedule.skip")}
    />
  )
}

/**
 * StepPublication
 * This component is used to update the publication options of the event.
 */
const StepPublication: React.FC<EventSafeProps> = ({ event, setEvent, onSkip }) => {
  const { _ } = useTranslation(dictionary)
  const { service, publishedUsers } = useEventsService()
  return (
    <PublicationEditStepDialog
      persistedId={event.id}
      publication={event.publication}
      service={service.id(event.id).publication}
      mutate={(publication: Api.Publication) => setEvent({ ...event, publication })}
      publishedUsers={publishedUsers}
      title={_("publication.title")}
      description={_("publication.description")}
      onNext={onSkip}
      nextLabel={_("publication.next")}
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
type EventProps = StepProps & {
  event: Api.EventWithRelations | null
  setEvent: React.Dispatch<React.SetStateAction<Api.EventWithRelations | null>>
}
type EventSafeProps = StepProps & {
  event: Api.EventWithRelations
  setEvent: React.Dispatch<React.SetStateAction<Api.EventWithRelations | null>>
  onSkip: () => void
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    failed: "Failed to create event",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    event: {
      title: "New event",
      description: "Fill in the basic details of your event.",
      submit: "Create event",
      skip: "Create and skip next steps",
    },
    seo: {
      title: "Search optimization",
      description: "Improve how your event appears in search results.",
      next: "Continue",
      skip: "Skip this step",
    },
    schedule: {
      title: "Event schedule",
      description: "Define when your event takes place.",
      next: "Continue",
      skip: "Skip this step",
    },
    publication: {
      title: "Publication settings",
      description: "Control when and how your event is published.",
      next: "Finish",
    },
  },
  fr: {
    failed: "Échec de la création de l'événement",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    event: {
      title: "Nouvel événement",
      description: "Remplissez les informations de base de l'événement.",
      submit: "Créer l'événement",
      skip: "Créer et ignorer les étapes suivantes",
    },
    seo: {
      title: "Optimisation pour les moteurs de recherche",
      description: "Améliorez l'apparence de votre événement dans les résultats de recherche.",
      next: "Continuer",
      skip: "Passer cette étape",
    },
    schedule: {
      title: "Planning de l'événement",
      description: "Définissez quand votre événement a lieu.",
      next: "Continuer",
      skip: "Passer cette étape",
    },
    publication: {
      title: "Paramètres de publication",
      description: "Contrôlez quand et comment votre événement est publié.",
      next: "Terminer",
    },
  },
  de: {
    failed: "Fehler beim Erstellen der Veranstaltung",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    event: {
      title: "Neue Veranstaltung",
      description: "Geben Sie die Grundinformationen Ihrer Veranstaltung ein.",
      submit: "Veranstaltung erstellen",
      skip: "Erstellen und nächste Schritte überspringen",
    },
    seo: {
      title: "Suchmaschinenoptimierung",
      description: "Verbessern Sie, wie Ihre Veranstaltung in Suchergebnissen erscheint.",
      next: "Weiter",
      skip: "Diesen Schritt überspringen",
    },
    schedule: {
      title: "Veranstaltungsplan",
      description: "Legen Sie fest, wann Ihre Veranstaltung stattfindet.",
      next: "Weiter",
      skip: "Diesen Schritt überspringen",
    },
    publication: {
      title: "Veröffentlichungseinstellungen",
      description: "Steuern Sie, wann und wie Ihre Veranstaltung veröffentlicht wird.",
      next: "Fertigstellen",
    },
  },
}
