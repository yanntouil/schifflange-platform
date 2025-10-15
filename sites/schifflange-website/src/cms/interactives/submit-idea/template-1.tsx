'use client'

import { Container } from '@/components/container'
import { Checkbox } from '@/components/forms/checkbox'
import { FieldInputFiles } from '@/components/forms/files'
import { FormGroup } from '@/components/forms/group'
import { FieldInput, FieldTextArea } from '@/components/forms/input'
import { FieldInputPhone } from '@/components/forms/input-phone'
import { Hn } from '@/components/hn'
import { ChipSvg, SignInArrowSvg } from '@/components/layout/icons'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { config } from '@/config'
import { useTranslation } from '@/lib/localize'
import { validate } from '@/utils/validate'
import { Interpolate } from '@compo/localize'
import { prose } from '@compo/ui/src/variants'
import { cn, match, S, stripHtml } from '@compo/utils'
import {
  ArrowSquareOut,
  CaretDownIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@phosphor-icons/react/dist/ssr'
import { cx } from 'class-variance-authority'
import React from 'react'
import { Form, useForm } from 'use-a11y-form'
import type { TemplateProps } from './index'

/**
 * Template 1
 * Simple layout - heading above, content below
 */
export function Template1({ props }: TemplateProps) {
  const { title, level, subtitle, description, displayHeading } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))

  return (
    <Wrapper paddingY>
      <Container padding='default'>
        {displayHeading && (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 pb-[24px]'>
            <div className='flex flex-col justify-center'>
              {title && (
                <Hn level={level} className={textVariants({ variant: 'title', color: 'tuna' })}>
                  {title}
                </Hn>
              )}
              {subtitle && (
                <p className={textVariants({ variant: 'subtitle', color: 'tuna' })}>{subtitle}</p>
              )}
              {hasDescription && (
                <div
                  className={prose({ variant: 'heading' })}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          </div>
        )}

        <div className='px-8 py-9 rounded-3xl bg-white'>
          <IdeaForm />
        </div>
      </Container>
    </Wrapper>
  )
}

const IdeaForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const form = useForm({
    allowSubmitAttempt: true,
    values: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organizationName: '',
      description: '',
      attachments: [],
      acceptTerms: false,
    },
    validate: validate({
      firstName: [validate.min(1, _('info.fields.firstName.errors.empty'))],
      lastName: [validate.min(1, _('info.fields.lastName.errors.empty'))],
      email: [validate.isEmail(_('info.fields.email.errors.invalid'))],
      phone: [
        validate.min(1, _('info.fields.phone.errors.empty')),
        value => (value.match(validate.regex.phone) ? null : _('info.fields.phone.errors.invalid')),
      ],
      organizationName: [validate.min(1, _('info.fields.organizationName.errors.empty'))],
      description: [validate.min(1, _('info.fields.description.errors.empty'))],
      acceptTerms: [validate.isTrue(_('info.fields.acceptTerms.errors.invalid'))],
    }),
    onSubmit: () => {},
  })

  return (
    <Form form={form}>
      <div className='flex flex-col gap-6 text-sm'>
        <Section title={_('info.title')}>
          <div className='grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2'>
            <FormGroup name='firstName' required label={_('info.fields.firstName.label')}>
              <FieldInput auto='given-name' placeholder={_('info.fields.firstName.placeholder')} />
            </FormGroup>

            <FormGroup name='lastName' required label={_('info.fields.lastName.label')}>
              <FieldInput auto='family-name' placeholder={_('info.fields.lastName.placeholder')} />
            </FormGroup>

            <FormGroup
              required
              name='organizationName'
              label={_('info.fields.organizationName.label')}
              className='md:col-span-2'
            >
              <FieldInput placeholder={_('info.fields.organizationName.placeholder')} />
            </FormGroup>

            <FormGroup name='email' required label={_('info.fields.email.label')}>
              <FieldInput placeholder={_('info.fields.email.placeholder')} />
            </FormGroup>

            <FormGroup name='phone' label={_('info.fields.phone.label')}>
              <FieldInputPhone />
            </FormGroup>
          </div>
        </Section>

        <Section title={_('idea.title')} required>
          <div className='grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2'>
            <FormGroup
              name='description'
              label={_('idea.fields.description.label')}
              className='md:col-span-2'
            >
              <FieldTextArea placeholder={_('idea.fields.description.placeholder')} />
            </FormGroup>
          </div>
        </Section>

        <Section title={_('attachments.title')} required>
          <div className='grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2'>
            <FormGroup
              name='attachments'
              label={_('attachments.fields.attachments.label')}
              className='md:col-span-2'
            >
              <FieldInputFiles
                accept={config.acceptedFileExtensions}
                multiple
                max={config.maxUploadFile}
              />
            </FormGroup>
          </div>
        </Section>

        <Form.Field name='acceptTerms'>
          <div className='flex items-start gap-x-3 mt-3'>
            <Form.FieldContext<boolean>>
              {field => (
                <Checkbox
                  id={field.id}
                  checked={field.value}
                  onCheckedChange={field.setFieldValue}
                />
              )}
            </Form.FieldContext>

            <Form.Label className='cursor-pointer select-none italic'>
              <Interpolate
                text={_('info.fields.acceptTerms.label')}
                replacements={{
                  anchor: content => {
                    const [name, label] = content.split(',')
                    const href = match(name)
                      .with('terms', () => config.termsAndServices)
                      .with('privacy', () => config.privacyPolicy)
                      .otherwise(() => '#')

                    return (
                      <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={cx(
                          'text-default/90 underline underline-offset-2 cursor-pointer'
                        )}
                      >
                        {label}
                      </a>
                    )
                  },
                }}
              />

              <span className='text-firebrick'>*</span>
            </Form.Label>
          </div>
        </Form.Field>

        <DataProtectionDisclosure />

        <ContactDisclosure />

        <div className='flex justify-end'>
          <Form.Submit asChild>
            <button
              className={cn(
                'rounded-[8px] h-[50px] inline-flex items-center px-6 gap-2',
                'text-xs data-[current=true]:font-semibold data-[active=true]:font-semibold',
                'bg-[#FFD167] data-[current=true]:bg-[#FFD167] data--[active=true]:bg-[#FFD167]',
                'text-[#1D1D1B] font-medium [&>svg]:size-[18px]'
              )}
            >
              {_(`submit`)}
              <SignInArrowSvg aria-hidden className='size-[19px]' />
            </button>
          </Form.Submit>
        </div>
      </div>
    </Form>
  )
}

/**
 * Section
 */
const Section = ({
  children,
  title,
  required,
}: React.PropsWithChildren<{ title?: string; required?: boolean }>) => {
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
    <h3 className='flex items-center text-sm font-semibold'>
      <ChipSvg aria-hidden className='size-4 shrink-0 mr-2' />
      {children}
      {required && <span className='text-firebrick mx-0.5'>*</span>}
    </h3>
  )
}

/**
 * DataProtectionDisclosure
 */
const DataProtectionDisclosure = () => {
  const { _ } = useTranslation(dictionary)
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className='p-6 rounded-xl bg-alabaster'>
      <p className='font-semibold mb-1 sr-only'>{_('info.dataProtectionDisclosure.title')}</p>
      <p className={cx('max-w-lg italic', expanded ? '' : 'line-clamp-2')}>
        {_('info.dataProtectionDisclosure.description')}
      </p>

      <ul className='flex items-center gap-x-6'>
        <li>
          <button
            type='button'
            onClick={() => setExpanded(!expanded)}
            className='flex items-center gap-x-2 icon:size-4 py-1.5 px-2 -m-2 rounded-lg mt-2'
          >
            {expanded
              ? _('info.dataProtectionDisclosure.collapse')
              : _('info.dataProtectionDisclosure.expand')}{' '}
            <CaretDownIcon className={cx(expanded ? 'rotate-180' : '')} />
          </button>
        </li>

        <li>
          <a
            href={config.privacyPolicy}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-x-2 icon:size-4 py-1.5 px-2 -m-2 rounded-lg mt-2'
          >
            {_('info.dataProtectionDisclosure.externalLink')}
            <ArrowSquareOut />
          </a>
        </li>
      </ul>
    </div>
  )
}

const ContactDisclosure = () => {
  const { _ } = useTranslation(dictionary)

  return (
    <div className='p-6 rounded-xl bg-glacier-20'>
      <p className='font-semibold mb-1 '>{_('info.contactDisclosure.title')}</p>
      <p>{_('info.contactDisclosure.description')}</p>

      <ul className='flex gap-x-8 gap-y-5 flex-wrap mt-4'>
        <li>
          <ProfileCard
            profile={{
              name: 'Carole Meyer',
              email: 'carole.meyer@men.lu',
              phone: '247-95158',
            }}
          />
        </li>
        <li>
          <ProfileCard
            profile={{
              name: 'Simone Mortini',
              email: 'simone.mortini@men.lu',
              phone: '247-86484',
            }}
          />
        </li>
      </ul>
    </div>
  )
}

const ProfileCard = (props: { profile: { name: string; email: string; phone?: string } }) => {
  const { profile } = props

  return (
    <article className=''>
      <p className='font-semibold mb-1.5'>{profile.name}</p>

      <a
        href={`mailto:${profile.email}`}
        className='underline underline-offset-2 flex mt-1 items-center gap-x-2 icon:size-4'
      >
        <EnvelopeIcon />
        {profile.email}
      </a>

      {profile.phone && (
        <a
          href={`tel:${profile.phone}`}
          className='underline underline-offset-2 flex mt-1 items-center gap-x-2 icon:size-4'
        >
          <PhoneIcon />
          {profile.phone}
        </a>
      )}
    </article>
  )
}

/**
 * translations
 */

const dictionary = {
  fr: {
    title: 'Déposez votre idée',
    description: 'Nous vous accompagnons pour la concrétiser',
    info: {
      title: 'Informations générales',
      fields: {
        firstName: {
          label: 'Prénom',
          placeholder: 'John',
          errors: {
            empty: 'Le nom ne peut pas être vide.',
          },
        },
        lastName: {
          label: 'Nom',
          placeholder: 'Smith',
          errors: {
            empty: 'Le nom ne peut pas être vide.',
          },
        },
        email: {
          label: 'Email',
          placeholder: 'john.smith@example.com',
          errors: {
            empty: "L'email ne peut pas être vide.",
            invalid: 'Entrez une adresse e-mail valide.',
          },
        },
        phone: {
          label: 'Téléphone',
          errors: {
            empty: 'Le téléphone ne peut pas être vide.',
            invalid: 'Entrez un numéro de téléphone valide.',
          },
        },
        organizationName: {
          label: "Nom de l'organisation",
          placeholder: 'LumiQ',
          errors: {
            empty: 'Le nom ne peut pas être vide.',
          },
        },
        description: {
          label: 'Description',
          placeholder: 'Description de votre idée',
          errors: {
            empty: 'La description ne peut pas être vide.',
          },
        },
        acceptTerms: {
          label:
            "En cochant cette case, vous acceptez nos {{anchor:terms,Conditions d'utilisation}} et {{anchor:privacy,Politique de confidentialité}}.",
          errors: {
            invalid: 'Vous devez accepter les termes.',
          },
        },
      },
      dataProtectionDisclosure: {
        title: 'Protection des données',
        description:
          'Les informations qui vous concernent recueillies sur ce formulaire font l’objet d’un traitement par l’administration concernée afin de mener à bien votre demande.',
        externalLink: 'Politique de confidentialité',
        expand: 'Lire plus',
        collapse: 'Lire moins',
      },
      contactDisclosure: {
        title: 'Contactez-nous',
        description: 'Nous sommes à votre écoute pour tout renseignement et/ou toute demande:',
      },
    },
    idea: {
      title: 'Votre idée',
    },
    attachments: {
      title: 'Pièces jointes',
    },
    submit: 'Envoyer',
  },
  en: {},
  de: {},
}
