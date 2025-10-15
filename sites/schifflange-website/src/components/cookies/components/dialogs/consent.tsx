'use client'

import { Link } from '@/components/link'
import { Button } from '@/components/ui/button'
import { config } from '@/config'
import { useTranslation } from '@/lib/localize'
import { Primitives } from '@compo/primitives'
import { cn } from '@compo/utils'
import { useCookies } from '../..'
import { dictionary } from '../../dictionary'

/**
 * ConsentDialog
 */
export const ConsentDialog = () => {
  const { _ } = useTranslation(dictionary)
  const { isConsented, setPreferences, acceptAll, rejectAll } = useCookies()
  // console.log({ isConsented })
  return (
    <Primitives.Dialog.Root open={!isConsented} modal={false}>
      <Primitives.Dialog.Portal>
        <Primitives.Dialog.Content
          className={cn(
            'fixed bottom-0 left-0 z-50 w-full rounded-md sm:bottom-4 sm:left-4 sm:max-w-lg',
            'border border-[#E5D2B9] bg-background shadow-sm',
            'duration-200',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
          )}
        >
          <div className='flex flex-col gap-1 border-b border-[#E5D2B9] p-4'>
            <Primitives.Dialog.Title className='text-base font-medium'>
              {_('consent.title')}
            </Primitives.Dialog.Title>
            <Primitives.Dialog.Description className='hyphens-auto text-pretty text-sm leading-tight text-foreground'>
              {_('consent.description')}
            </Primitives.Dialog.Description>
          </div>
          <div className='flex flex-wrap justify-center gap-4 border-b border-[#E5D2B9] px-4 py-2 sm:justify-between'>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button scheme='outline' onClick={acceptAll}>
                {_('consent.accept-all')}
              </Button>
              <Button scheme='outline' onClick={rejectAll}>
                {_('consent.reject-all')}
              </Button>
            </div>
            <Button onClick={() => setPreferences(true)}>{_('consent.manage-cookies')}</Button>
          </div>
          <div className='flex flex-wrap justify-center gap-4 px-4 py-2 sm:justify-start'>
            <Link
              href={config.privacyPolicy}
              className={cn('text-sm text-foreground hover:underline focus:underline')}
            >
              {_('consent.data-protection')}
            </Link>
            <Link
              href={config.termsAndServices}
              className={cn('text-sm text-foreground hover:underline focus:underline')}
            >
              {_('consent.legal-notice')}
            </Link>
          </div>
        </Primitives.Dialog.Content>
      </Primitives.Dialog.Portal>
    </Primitives.Dialog.Root>
  )
}
