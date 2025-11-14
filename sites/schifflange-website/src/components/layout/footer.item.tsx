"use client"

import { Api } from "@/service"
import { cva, cxm, match } from "@compo/utils"
import { useCookies } from "../cookies"
import { Ui } from "../ui"

/**
 * FooterMenuItem
 * a menu item
 */
type FooterMenuItemProps = {
  item: Api.MenuItemWithRelations
}
export const FooterMenuItem = ({ item }: FooterMenuItemProps) => {
  if (item.type === "link" && item.props.link === "[manage-cookies]") {
    return <CookieItem>{item.translations?.name || ""}</CookieItem>
  }
  return match(item)
    .with({ type: "resource" }, (item) => (
      <Ui.Link href={item.slug.path} className={itemVariants()}>
        {item.translations?.name || ""}
      </Ui.Link>
    ))
    .with({ type: "link" }, (item) => (
      <Ui.Link href={item.props.link} className={itemVariants()}>
        {item.translations?.name || ""}
      </Ui.Link>
    ))
    .with({ type: "url" }, (item) => (
      <a
        href={item.translations.props.url}
        className={itemVariants()}
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        {item.translations?.name || ""}
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

const itemVariants = cva(
  cxm(
    "text-secondary uppercase cursor-pointer text-left font-bold text-xs py-1 inline-block rounded-xs",
    Ui.variants.disabled(),
    Ui.variants.focus({ variant: "visible" })
  )
)
