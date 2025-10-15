import { Button } from '@/components/ui/button'
import { Api } from '@/service'
import { getServerTranslation } from '@/utils/localize'
import { LocalizeLanguage } from '@compo/localize'
import { ListIcon, XIcon } from '@phosphor-icons/react/ssr'
import { cx } from 'class-variance-authority'
import { Popover, Portal } from 'radix-ui'
import { Link } from '../link'
import { HeaderBottom } from './header.bottom'
import { HeaderTop } from './header.top'
import { LogoSquare } from './logo'

/**
 * header
 * the header of the page
 */
type HeaderProps = {
  lang: LocalizeLanguage
  menu: Api.MenuItemWithRelations[]
}

export const Header = ({ lang, menu }: HeaderProps) => {
  // conditionally wrap content in portal if on wide screen, avoiding js based media query hooks
  return (
    <>
      <Portal.Root className='hidden lg:block'>
        <HeaderContent lang={lang} menu={menu} />
      </Portal.Root>

      <div className='lg:hidden'>
        <HeaderContent lang={lang} menu={menu} />
      </div>
    </>
  )
}

export const HeaderContent = ({ lang, menu }: HeaderProps) => {
  const { _ } = getServerTranslation(lang, dictionary)

  return (
    <div
      className={cx(
        'lg:fixed lg:inset-y-0 lg:left-0 px-6 py-4 lg:p-[40px] lg:pr-4 lg:w-(--layout-sidebar-width) ',
        'flex flex-col gap-y-9 justify-between overflow-y-scroll scrollbar-none'
      )}
    >
      <div className='flex flex-col gap-[23px]'>
        <div className='flex justify-between items-center lg:items-end'>
          <Link href='/'>
            <LogoSquare className='w-[68px]' aria-label={_('logo')} />
          </Link>

          <Popover.Root>
            <Popover.Trigger asChild>
              <Button scheme='secondary' variant='icon' className='group/button lg:hidden'>
                <ListIcon
                  aria-label={_('wrap-menu')}
                  className='group-data-[state=open]/button:hidden'
                />
                <XIcon
                  aria-label={_('close-menu')}
                  className='group-data-[state=closed]/button:hidden'
                />
              </Button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                style={{ boxShadow: '0 9000px 0 9000px rgba(0, 0, 0, 0.20)' }}
                className='p-6 rounded-b-3xl bg-[#FAF6F1] border-b-[1px] border-black/10 w-(--radix-popper-available-width) z-50'
                collisionPadding={0}
                sideOffset={28}
                align='end'
              >
                <HeaderTop lang={lang} menu={menu} />
                <hr className='my-6' />
                <HeaderBottom lang={lang} menu={menu} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div className='hidden lg:block'>
          <HeaderTop lang={lang} menu={menu} />
        </div>
      </div>

      <div className='hidden lg:block'>
        <HeaderBottom lang={lang} menu={menu} />
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    logo: 'Logo Lumiq',
    'wrap-menu': 'Agrandir le menu',
  },
  en: {
    logo: 'Lumiq logo',
    'wrap-menu': 'Expand the menu',
  },
  de: {
    logo: 'Lumiq Logo',
    'wrap-menu': 'Menü vergrößern',
  },
}
