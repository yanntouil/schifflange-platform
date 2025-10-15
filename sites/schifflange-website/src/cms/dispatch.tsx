import { Container } from '@/components/container'
import { Wrapper } from '@/components/wrapper'
import type { LocalizeLanguage } from '@/lib/localize'
import { Api } from '@/service'
import { getServerTranslation } from '@/utils/localize'
import { D, G } from '@compo/utils'
import type { AvailableItemTypes, InferItemAsync, RenderAsyncProps } from '@contents/lumiq/ssr'
import React from 'react'
import items from '.'
import { env } from '../env'

const debug = false

/**
 * Dispatch
 */
type Props = {
  item: Api.ContentItem
  locale: LocalizeLanguage
  path: string
  searchParams: Record<string, unknown>
}

export default async function Dispatch({ item, locale, path, searchParams }: Props) {
  const validItem = itemGuard(item)
  const Component = D.get(items, validItem.type)

  if (G.isNullable(Component)) return <MissingComponent type={validItem.type} locale={locale} />

  const template = 'template' in item.props ? (item.props.template as string) : 'default'
  if (debug) console.log(`Build ${item.type} ${template}`)

  const props: RenderAsyncProps<typeof validItem.type> = {
    item: validItem,
    locale,
    path,
    searchParams,
  }

  const component = (
    <ComponentDebug type={validItem.type} template={template} debug={false}>
      {/* @ts-expect-error - TODO: fix this */}
      <Component {...props} />
    </ComponentDebug>
  )

  return component
}

const ComponentDebug = ({
  type,
  template,
  children,
  debug,
}: {
  type: string
  template: string
  children: React.ReactNode
  debug: boolean
}) => {
  if (!env.dev) return children

  return React.createElement(
    type,
    {
      [template]: '',
    },
    debug
      ? [
          <div className='relative border-2 border-green-400'>
            <div className='absolute right-0 top-0 z-[1000] rounded-md rounded-r-none rounded-t-none bg-green-950 px-2 py-1 text-[11px] font-medium tracking-wide text-white'>
              {type}
            </div>
            {children}
          </div>,
        ]
      : children
  )
}

/**
 * MissingComponent
 * Displays a missing component message in place of the component
 */
const MissingComponent = ({ type, locale }: { type: string | undefined; locale: string }) => {
  const { _ } = getServerTranslation(locale, dictionary)
  return (
    <Wrapper className='py-12 sm:py-16'>
      <Container>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>{_('title')}</h1>
          <p className='text-sm text-neutral-500'>
            {_('description', { type: type ?? _('unknown') })}
          </p>
        </div>
      </Container>
    </Wrapper>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: 'Le composant est manquant.',
    description: "Le composant pour {{type}} n'existe pas.",
    unknown: 'le type inconnue',
  },
  en: {
    title: 'The component is missing.',
    description: 'The component for {{type}} does not exist.',
    unknown: 'unknown type',
  },
  de: {
    title: 'Der Komponente fehlt.',
    description: 'Der Komponente für {{type}} existiert nicht.',
    unknown: 'unbekannte Typ',
  },
}

/**
 * itemGuard
 * force the type of the item to be the one of the component
 */
const itemGuard = (item: Api.ContentItem) => {
  return item as InferItemAsync<AvailableItemTypes>
}
