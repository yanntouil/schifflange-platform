"use client"

import { Api } from "@/service"
import { cva, cxm, match } from "@compo/utils"
import { useCookies } from "../cookies"
import { Ui } from "../ui"

/**
 * FooterMenuItem
 * a menu item
 */
type HeaderTopItemProps = {
  item: Api.MenuItemWithRelations
  isScrolled: boolean
}
export const HeaderTopItem = ({ item, isScrolled }: HeaderTopItemProps) => {
  const className = itemVariants({ isScrolled })
  if (item.type === "link" && item.props.link === "[manage-cookies]") {
    return <CookieItem className={className}>{item.translations?.name || ""}</CookieItem>
  }
  return match(item)
    .with({ type: "resource" }, (item) => (
      <Ui.Link href={item.slug.path} className={className}>
        {item.translations?.name || ""}
      </Ui.Link>
    ))
    .with({ type: "link" }, (item) => (
      <Ui.Link href={item.props.link} className={className}>
        {item.translations?.name || ""}
      </Ui.Link>
    ))
    .with({ type: "url" }, (item) => (
      <a href={item.translations.props.url} className={className} target='_blank' rel='noopener noreferrer nofollow'>
        {item.translations?.name || ""}
      </a>
    ))
    .otherwise(() => null)
}

const CookieItem = (props: React.ComponentProps<"button">) => {
  const { setPreferences } = useCookies()
  return <button {...props} onClick={() => setPreferences(true)} />
}

export const itemVariants = cva(
  cxm(
    "text-primary-foreground uppercase cursor-pointer text-left font-bold text-xs/none inline-flex items-center rounded-xs py-1",
    "transition-all duration-300 ease-in-out",
    Ui.variants.disabled(),
    Ui.variants.focus({ variant: "visible" })
  ),
  {
    variants: {
      isScrolled: {
        true: "px-1",
        false: "px-3",
      },
    },
  }
)
