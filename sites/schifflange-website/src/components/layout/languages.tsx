'use client'

import { useTranslation } from '@/lib/localize'
import { cn } from '@compo/utils'
import { usePathname } from 'next/navigation'
import { Link } from '../link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { itemVariants } from './header.variants'

/**
 * Languages
 * Language selector component for the header
 */
export const Languages = () => {
  const { _, language, languages } = useTranslation(dictionary)
  // Remove the language prefix from the current path
  const pathname = usePathname()
  const pathWithoutLang = pathname.replace(/^\/(fr|en|de)/, '') || '/'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(itemVariants(), 'grow justify-center')}>
          {_(`language-${language}`)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start' sideOffset={8} className='z-50'>
        {languages.map(lang => (
          <DropdownMenuItem key={lang} asChild>
            <Link href={pathWithoutLang} lang={lang}>
              {_(`language-${lang}`)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    'language-fr': 'Français',
    'language-en': 'Anglais',
    'language-de': 'Allemand',
  },
  en: {
    'language-fr': 'French',
    'language-en': 'English',
    'language-de': 'German',
  },
  de: {
    'language-fr': 'Französisch',
    'language-en': 'Englisch',
    'language-de': 'Deutsch',
  },
}
