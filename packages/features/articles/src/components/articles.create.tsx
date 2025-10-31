import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { PublicationEditStepDialog } from "@compo/publications"
import { SeoEditStepDialog } from "@compo/seos"
import { Ui } from "@compo/ui"
import { G, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { useArticlesService } from "../service.context"
import { ArticlesForm } from "./articles.form"

/**
 * ArticlesCreateDialog
 */
export const ArticlesCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.ArticleWithRelations>> = ({
  item,
  ...props
}) => {
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
 * This component is used to create a new article. It will navigate to the next step after creation.
 */
type Step = "article" | "seo" | "publication"
const CreateContent: React.FC<{ mutate?: (value: Api.ArticleWithRelations) => Promise<void> }> = ({ mutate }) => {
  const { _ } = useTranslation(dictionary)
  const [step, setStep] = React.useState<Step>("article")
  const [article, setArticle] = React.useState<Api.ArticleWithRelations | null>(null)
  const { routesTo } = useArticlesService()
  const { close } = Ui.useQuickDialogContext()
  const [, navigate] = useLocation()
  const onSkip = () => {
    close()
    if (article) navigate(routesTo.articles.byId(article.id ?? ""))
  }
  const commonProps = { setArticle, step, setStep, onSkip }
  if (article) {
    if (step === "seo") return <StepSeo {...commonProps} article={article} />
    if (step === "publication") return <StepPublication {...commonProps} article={article} />
  }
  return <StepArticle {...commonProps} article={null} mutate={mutate} />
}

/**
 * StepArticle
 * This component is used to create a new article. It will navigate to the next step after creation.
 */
const StepArticle: React.FC<ArticleProps & { mutate?: (value: Api.ArticleWithRelations) => Promise<void> }> = ({
  article,
  setArticle,
  setStep,
  mutate,
}) => {
  const { _ } = useTranslation(dictionary)
  const { service, routesTo } = useArticlesService()
  const [, navigate] = useLocation()
  const { close } = Ui.useQuickDialogContext()
  const initialValues = {
    state: "draft" as const,
    categoryId: "none",
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        categoryId: values.categoryId === "none" ? null : values.categoryId,
      }
      return match(await service.create(payload))
        .with({ ok: true }, async ({ data: { article } }) => {
          await mutate?.(article)
          setArticle(article)
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
      categoryId: form.values.categoryId === "none" ? null : form.values.categoryId,
    }
    match(await service.create(payload))
      .with({ ok: true }, async ({ data: { article } }) => {
        await mutate?.(article)
        close()
        navigate(routesTo.articles.byId(article.id ?? ""))
      })
      .otherwise(async ({ except }) => {
        if (except?.name === "E_VALIDATION_FAILURE") form.setAssertive(_("validation"))
        else Ui.toast.error(_("failed"))
      })
  }

  return (
    <Ui.QuickDialogContent
      title={_("article.title")}
      description={_("article.description")}
      classNames={{ content: "sm:max-w-screen-sm" }}
      sticky
    >
      <Form.Root form={form} className='space-y-6'>
        <Form.Assertive />
        <ArticlesForm />
        <Ui.QuickDialogStickyFooter>
          <Form.Submit>
            <SaveAll aria-hidden />
            {_("article.submit")}
          </Form.Submit>
          <Ui.Button variant='outline' onClick={handleSkip}>
            {_("article.skip")}
            <ArrowRight aria-hidden />
          </Ui.Button>
        </Ui.QuickDialogStickyFooter>
      </Form.Root>
    </Ui.QuickDialogContent>
  )
}

/**
 * StepSeo
 * This component is used to update the SEO of the article.
 */
const StepSeo: React.FC<ArticleSafeProps> = ({ article, setArticle, setStep, onSkip }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  return (
    <SeoEditStepDialog
      persistedId={article.id}
      seo={article.seo}
      service={service.id(article.id).seo}
      mutate={(seo: Api.Seo) => setArticle({ ...article, seo })}
      title={_("seo.title")}
      description={_("seo.description")}
      onNext={() => setStep("publication")}
      nextLabel={_("seo.next")}
      onSkip={onSkip}
      skipLabel={_("seo.skip")}
    />
  )
}

/**
 * StepPublication
 * This component is used to update the publication options of the article.
 */
const StepPublication: React.FC<ArticleSafeProps> = ({ article, setArticle, onSkip }) => {
  const { _ } = useTranslation(dictionary)
  const { service, publishedUsers } = useArticlesService()
  return (
    <PublicationEditStepDialog
      persistedId={article.id}
      publication={article.publication}
      service={service.id(article.id).publication}
      mutate={(publication: Api.Publication) => setArticle({ ...article, publication })}
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
type ArticleProps = StepProps & {
  article: Api.ArticleWithRelations | null
  setArticle: React.Dispatch<React.SetStateAction<Api.ArticleWithRelations | null>>
}
type ArticleSafeProps = StepProps & {
  article: Api.ArticleWithRelations
  setArticle: React.Dispatch<React.SetStateAction<Api.ArticleWithRelations | null>>
  onSkip: () => void
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    failed: "Failed to create article",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    article: {
      title: "New article",
      description: "Fill in the basic details of your article.",
      submit: "Create article",
      skip: "Create and skip next steps",
    },
    seo: {
      title: "Search optimization",
      description: "Improve how your article appears in search results.",
      next: "Continue",
      skip: "Skip this step",
    },
    publication: {
      title: "Publication settings",
      description: "Control when and how your article is published.",
      next: "Finish",
    },
  },
  fr: {
    failed: "Échec de la création de l'article",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    article: {
      title: "Nouvel article",
      description: "Remplissez les informations de base de l'article.",
      submit: "Créer l'article",
      skip: "Créer et ignorer les étapes suivantes",
    },
    seo: {
      title: "Optimisation pour les moteurs de recherche",
      description: "Améliorez l'apparence de votre article dans les résultats de recherche.",
      next: "Continuer",
      skip: "Passer cette étape",
    },
    publication: {
      title: "Paramètres de publication",
      description: "Contrôlez quand et comment votre article est publié.",
      next: "Terminer",
    },
  },
  de: {
    failed: "Fehler beim Erstellen des Artikels",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    article: {
      title: "Neuer Artikel",
      description: "Geben Sie die Grundinformationen Ihres Artikels ein.",
      submit: "Artikel erstellen",
      skip: "Erstellen und nächste Schritte überspringen",
    },
    seo: {
      title: "Suchmaschinenoptimierung",
      description: "Verbessern Sie, wie Ihr Artikel in Suchergebnissen erscheint.",
      next: "Weiter",
      skip: "Diesen Schritt überspringen",
    },
    publication: {
      title: "Veröffentlichungseinstellungen",
      description: "Steuern Sie, wann und wie Ihr Artikel veröffentlicht wird.",
      next: "Fertigstellen",
    },
  },
}
