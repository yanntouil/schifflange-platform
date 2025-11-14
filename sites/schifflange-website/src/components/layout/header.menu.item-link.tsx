"use client"

import { match } from "@compo/utils"
import React from "react"
import { Api } from "../../service"
import { Ui } from "../ui"

/**
 * ItemLink
 * display a link and manage type to make right navigation
 */
export type ItemLinkProps = {
  item: Api.MenuItemLink | Api.MenuItemResource | Api.MenuItemUrl
  className?: string
  children?: React.ReactNode
}
export const ItemLink = React.forwardRef<HTMLAnchorElement, ItemLinkProps>((props, ref) => {
  const { item, className, children } = props
  return match(item)
    .with({ type: "resource" }, (item) => (
      <Ui.Link href={item.slug.path} ref={ref} className={className}>
        {children || item.translations?.name || ""}
      </Ui.Link>
    ))
    .with({ type: "link" }, (item) => (
      <Ui.Link href={item.props.link} ref={ref} className={className}>
        {children || item.translations?.name || ""}
      </Ui.Link>
    ))
    .with({ type: "url" }, (item) => (
      <a
        href={item.translations.props.url}
        target='_blank'
        rel='noopener noreferrer nofollow'
        ref={ref}
        className={className}
      >
        {children || item.translations?.name || ""}
      </a>
    ))
    .otherwise(() => null)
})
