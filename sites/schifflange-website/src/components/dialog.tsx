'use client'

import { useTranslation } from '@/lib/localize'
import { Primitives } from '@compo/primitives'
import { cn, S } from '@compo/utils'
import { XIcon } from './layout/icons'

/**
 * Dialog
 */
export const Dialog = (props: {
  trigger?: React.ReactNode
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { trigger, title, description, children, open, onOpenChange } = props
  const { _ } = useTranslation(dictionary)
  return (
    <Primitives.Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!!trigger && <Primitives.Dialog.Trigger asChild>{trigger}</Primitives.Dialog.Trigger>}
      <Primitives.Dialog.Portal>
        <Primitives.Dialog.Overlay className='fixed inset-0 bg-[#1D1D1B]/60 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>
          <Primitives.Dialog.Content
            className={cn(
              'relative my-8 mx-auto w-[90vw] max-w-[562px] bg-white rounded-[16px] px-8 pt-10 pb-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              props.className
            )}
          >
            <div className='flex flex-col gap-4'>
              {(title || description) && <DialogHead title={title} description={description} />}

              <div>{children}</div>
            </div>
            <Primitives.Dialog.Close className='absolute top-4 right-4'>
              <XIcon aria-label={_('close')} className='size-5' />
            </Primitives.Dialog.Close>
          </Primitives.Dialog.Content>
        </Primitives.Dialog.Overlay>
      </Primitives.Dialog.Portal>
    </Primitives.Dialog.Root>
  )
}

/**
 *
 */

export const DialogHead = (props: { title?: string; description?: string }) => {
  const { title, description } = props
  return (
    <div className='space-y-2'>
      <Primitives.Dialog.Title className='text-xl font-semibold'>{title}</Primitives.Dialog.Title>

      <Primitives.Dialog.Description className='text-sm font-normal empty:hidden'>
        {description}
      </Primitives.Dialog.Description>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    close: 'Fermer la boîte de dialogue',
  },
  en: {
    close: 'Close the dialog',
  },
  de: {
    close: 'Dialog schließen',
  },
}
