'use client'
import { Api } from '@/service'
import { LocalizeLanguage } from '@compo/localize'
import { A, match } from '@compo/utils'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import { cx } from 'class-variance-authority'
import { Collapsible } from 'radix-ui'
import React from 'react'
import { FormIdeaDialog } from '../dialogs/form-idea'
import { Link } from '../link'
import { itemVariants } from './header.variants'
import { spacing } from '@/lib/utils'

/**
 * HeaderTop
 */
type HeaderProps = {
  lang: LocalizeLanguage
  menu: Api.MenuItemWithRelations[]
}
export const HeaderTop = ({ lang, menu }: HeaderProps) => {
  const sortedItems = React.useMemo(() => {
    return menu.toSorted((a, b) => a.order - b.order)
  }, [menu])

  return (
    <ul
      className='flex flex-col gap-(--menu-item-gap)'
      style={
        {
          '--menu-item-gap': spacing(2),
          '--menu-item-group-spacing': spacing(3),
        } as React.CSSProperties
      }
    >
      {sortedItems.map(item => (
        <li key={item.id}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  )
}

/**
 * ItemGroup
 */
const ItemGroup = ({ item }: { item: Api.MenuItemGroup }) => {
  return (
    <Collapsible.Root className='data-[state=open]:my-(--menu-item-group-spacing) duration-300 transition-all'>
      <Collapsible.Trigger asChild>
        <button className={cx(itemVariants(), 'group/item')}>
          <span>{item.translations?.name || ''}</span>
          <CaretDownIcon className='group-data-[state=open]/item:rotate-180 transition-all' />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <ul className='flex flex-col gap-2 py-(--menu-item-gap)'>
          {item.items.map(item => (
            <li key={item.id}>
              <Item item={item as Api.MenuItemWithRelations} />
            </li>
          ))}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

/**
 * Item
 */
type ItemProps = {
  item: Api.MenuItemWithRelations
}
const Item = ({ item }: ItemProps) => {
  if (item.type === 'link' && item.props.link.includes('?submit-your-idea')) {
    return (
      <FormIdeaDialog>
        <button className={itemVariants()}>{item.translations?.name || ''}</button>
      </FormIdeaDialog>
    )
  }

  return match(item)
    .with({ type: 'resource' }, item => (
      <Link href={item.slug.path} className={itemVariants()}>
        <span>{item.translations?.name || ''}</span>
      </Link>
    ))
    .with({ type: 'link' }, item => (
      <Link href={item.props.link} className={itemVariants()}>
        <span>{item.translations?.name || ''}</span>
      </Link>
    ))
    .with({ type: 'url' }, item => (
      <a
        href={item.translations.props.url}
        className={itemVariants()}
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        <span>{item.translations?.name || ''}</span>
      </a>
    ))
    .with({ type: 'group' }, item => <ItemGroup item={item} />)
    .otherwise(() => null)
}
