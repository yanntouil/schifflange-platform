"use client"

import { useTranslation } from "@/lib/localize"
import { cn } from "@compo/utils"
import { Dialog } from "../dialog"
import { ChipSvg, SignInArrowSvg } from "../layout/icons"

/**
 * FormIdeaDialog
 */
export const FormIdeaDialog = (props: React.PropsWithChildren) => {
  const { children } = props
  const { _ } = useTranslation(dictionary)
  return (
    <Dialog trigger={children} title={_(`title`)} description={_(`description`)}>
      <div className='flex flex-col gap-6 text-sm'>
        <Section title={_("info.title")}>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("idea.title")} required>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("objectives.title")} required>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("target.title")} required>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("needs.title")} required>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("related.title")} required>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("resources.title")}>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <Section title={_("attachments.title")}>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </Section>
        <div className='flex justify-end'>
          <button
            className={cn(
              "rounded-[8px] h-[50px] inline-flex items-center px-6 gap-2",
              "text-xs data-[current=true]:font-semibold data-[active=true]:font-semibold",
              "bg-[#FFD167] data-[current=true]:bg-[#FFD167] data--[active=true]:bg-[#FFD167]",
              "text-[#1D1D1B] font-medium [&>svg]:size-[18px]"
            )}
          >
            {_(`submit`)}
            <SignInArrowSvg aria-hidden className='size-[19px]' />
          </button>
        </div>
      </div>
    </Dialog>
  )
}

/**
 * Section
 */
const Section = ({ children, title, required }: React.PropsWithChildren<{ title?: string; required?: boolean }>) => {
  return (
    <div className='space-y-2'>
      {title && <Title required={required}>{title}</Title>}
      <div className='pl-6'>{children}</div>
    </div>
  )
}

/**
 * Title
 */
const Title = ({ children, required }: React.PropsWithChildren<{ required?: boolean }>) => {
  return (
    <h3 className='flex items-center gap-2 text-sm font-semibold'>
      <ChipSvg aria-hidden className='size-4 shrink-0' />
      {children}
      {required && <span className='text-[#C1121F]'>*</span>}
    </h3>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Déposez votre idée",
    description: "Déposez votre idée, nous vous accompagnons pour la concrétiser",
    info: {
      title: "Informations sur le porteur de l’idée",
    },
    idea: {
      title: "Votre idée",
    },
    objectives: {
      title: "Objectifs visés",
    },
    target: {
      title: "Public concerné",
    },
    needs: {
      title: "Besoins identifiés",
    },
    related: {
      title: "Ressources ou partenaires envisagés",
    },
    resources: {
      title: "Ressources ou partenaires envisagés",
    },
    attachments: {
      title: "Pièces jointes",
    },
    submit: "Envoyer",
  },
  en: {
    title: "Submit your idea",
    description: "Submit your idea, we accompany you to concretize it",
    info: {
      title: "Information about the idea's holder",
    },
    idea: {
      title: "Your idea",
    },
    objectives: {
      title: "Objectives",
    },
    target: {
      title: "Public concerned",
    },
    needs: {
      title: "Identified needs",
    },
    related: {
      title: "Resources or partners envisaged",
    },
    resources: {
      title: "Resources or partners envisaged",
    },
    attachments: {
      title: "Attachments",
    },
    submit: "Submit",
  },
  de: {
    title: "Ihre Idee einreichen",
    description: "Ihre Idee einreichen, wir begleiten Sie dabei, sie zu konkretisieren",
    info: {
      title: "Informationen über den Ideenhalter",
    },
    idea: {
      title: "Ihre Idee",
    },
    objectives: {
      title: "Zielgruppen",
    },
    target: {
      title: "Zielgruppen",
    },
    needs: {
      title: "Identifizierte Bedürfnisse",
    },
    related: {
      title: "Ressourcen oder Partnern",
    },
    resources: {
      title: "Ressourcen oder Partnern",
    },
    attachments: {
      title: "Anhänge",
    },
    submit: "Einreichen",
  },
}
