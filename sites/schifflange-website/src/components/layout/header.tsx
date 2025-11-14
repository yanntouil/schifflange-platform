import { Api } from "@/service"
import { LocalizeLanguage } from "@compo/localize"
import { Portal } from "radix-ui"
import { HeaderDesktop } from "./header.desktop"

/**
 * header
 * the header of the page
 */
export type HeaderProps = {
  lang: LocalizeLanguage
  menu: Api.MenuItemWithRelations[]
  topMenu: Api.MenuItemWithRelations[]
}

export const Header = (props: HeaderProps) => {
  return (
    <>
      <Portal.Root className='hidden lg:block'>
        <HeaderDesktop {...props} />
      </Portal.Root>
      <div className='lg:hidden'>
        {/* add mobile menu here */}
        {/* <HeaderMobile {...props} /> */}
      </div>
    </>
  )
}
