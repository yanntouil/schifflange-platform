"use client"

import { Api } from "@/service"
import { cva, match } from "@compo/utils"
import { useCookies } from "../cookies"
import { Link } from "../link"

/**
 * Item
 * a menu item
 */
type ItemProps = {
  item: Api.MenuItemWithRelations
}
export const Item = ({ item }: ItemProps) => {
  if (item.type === "link" && item.props.link === "manage-cookies") {
    return <CookieItem>{item.translations?.name || ''}</CookieItem>
  }
  return match(item)
    .with({ type: "resource" }, (item) => (
      <Link href={item.slug.path} className={itemVariants()}>
        {item.translations?.name || ''}
      </Link>
    ))
    .with({ type: "link" }, (item) => (
      <Link href={item.props.link} className={itemVariants()}>
        {item.translations?.name || ''}
      </Link>
    ))
    .with({ type: "url" }, (item) => (
      <a
        href={item.translations.props.url}
        className={itemVariants()}
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        {item.translations?.name || ''}
      </a>
    ))
    .otherwise(() => null)
}

const CookieItem = (props: React.PropsWithChildren) => {
  const { setPreferences } = useCookies()
  return (
    <button className={itemVariants()} onClick={() => setPreferences(true)}>
      {props.children}
    </button>
  )
}

const itemVariants = cva("text-[#5D5F72] cursor-pointer")
