import { LocalizeLanguage } from '@/lib/localize'
import { Api } from '@/service'
import { getServerTranslation } from '@/utils/localize'
import { A } from '@compo/utils'
import { Link } from '../link'
import { Item } from './footer.item'
import { Logo101, LogoCondensed } from './logo'

/**
 * footer
 * the footer of the page
 */
type FooterProps = {
  lang: LocalizeLanguage
  menu: Api.MenuItemWithRelations[]
}
export const Footer = ({ lang, menu }: FooterProps) => {
  return (
    <div className='lg:pl-(--layout-sidebar-width) mx-auto w-full py-[40px] px-[40px]'>
      <div className='grid grid-cols-[100px_1fr_100px] gap-4 w-full bg-white rounded-[16px] px-5 text-[10px] min-h-[69px] items-center'>
        <FooterLeft lang={lang} />
        <FooterMenu lang={lang} menu={menu} />
        <FooterRight lang={lang} />
      </div>
    </div>
  )
}

export const FooterMenu = ({ menu }: FooterProps) => {
  return (
    <ul className='flex items-center gap-2 justify-center'>
      {A.mapWithIndex(menu, (index, item) => (
        <li className='flex items-center gap-2' key={item.id}>
          <Item item={item} />
          {index < menu.length - 1 && (
            <span className='text-[#AEAFB9]' aria-hidden>
              /
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * FooterLeft
 * the left part of the footer
 */
const FooterLeft = ({ lang }: { lang: LocalizeLanguage }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  return (
    <Link href='/'>
      <LogoCondensed className='w-[74px' aria-label={_('logo')} />
    </Link>
  )
}

/**
 * FooterRight
 * the right part of the footer
 */
const FooterRight = ({ lang }: { lang: LocalizeLanguage }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  return (
    <div className='flex justify-end'>
      <a
        href='https://101.lu'
        target='_blank'
        rel='noopener noreferrer nofollow'
        className='flex items-center gap-2'
      >
        {_('powered')}
        <Logo101 className='w-[23px] inline-block' aria-label={_('powered-101')} />
      </a>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    logo: 'LumiQ',
    cookies: 'Manage cookies',
    powered: 'Powered by',
  },
  fr: {
    logo: 'LumiQ',
    cookies: 'Gérer les cookies',
    powered: 'Réalisé par',
    'powered-101': '101 Studios',
  },
  de: {
    logo: 'Lumiq',
    cookies: 'Cookies verwalten',
    powered: 'Powered by',
  },
}
