"use client"

import { cxm } from "@compo/utils"
import { A } from "@mobily/ts-belt"
import { Container } from "./container"
import { type HeaderProps } from "./header"
import { HeaderTopItem } from "./header.top.item"
import { HeaderLanguages } from "./header.top.languages"
import { HeaderSearch } from "./header.top.search"
import { Wrapper } from "./wrapper"

/**
 * display the red top menu of the header
 */
export const HeaderTop = (props: HeaderProps & { isScrolled: boolean }) => {
  const { topMenu, isScrolled } = props
  return (
    <Wrapper className='bg-primary text-primary-foreground [&_a]:focus-visible:ring-offset-primary [&_button]:focus-visible:ring-offset-primary'>
      <Container className={cxm("flex justify-end items-center gap-0.5", isScrolled ? "py-1" : "py-2")}>
        {A.map(topMenu, (item) => (
          <HeaderTopItem key={item.id} item={item} isScrolled={isScrolled} />
        ))}
        <HeaderLanguages {...props} />
        <HeaderSearch />
      </Container>
    </Wrapper>
  )
}
