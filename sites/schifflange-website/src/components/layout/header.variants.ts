import { cn, cva } from '@compo/utils'

/**
 * buttonVariants
 */
export const itemVariants = cva(
  [
    'rounded-[8px] h-13 inline-flex items-center justify-start w-full px-5 gap-2 min-w-0 text-start truncate',
    'text-xs data-[active=true]:font-semibold ',
    '[&>span]:flex-1 [&>span]:truncate',
  ],
  {
    variants: {
      scheme: {
        default: cn(
          'bg-white data-[active=true]:bg-[#98C5D5] data--[active=true]:bg-[#98C5D5] data-[state=open]:bg-[#d6e8ee] hover:bg-[#d6e8ee]',
          'text-[#1D1D1B] font-base'
        ),
        accessibility: cn(
          'bg-[#BBDAB0] data-[active=true]:bg-[#BBDAB0] data--[active=true]:bg-[#BBDAB0]',
          'text-[#35374F] font-base [&>svg]:size-[20px]'
        ),
        highlight: cn(
          'bg-[#FFD167] data-[active=true]:bg-[#FFD167] data--[active=true]:bg-[#FFD167]',
          'text-[#1D1D1B] font-medium [&>svg]:size-[18px]'
        ),
      },
    },
    defaultVariants: {
      scheme: 'default',
    },
  }
)
