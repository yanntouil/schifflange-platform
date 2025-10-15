import { AutoGrid } from '@/components/auto-grid'

/**
 * Card grid
 */

export const CardGrid: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <AutoGrid min={250} shrink className='gap-x-10 gap-y-9 items-stretch'>
    {children}
  </AutoGrid>
)
