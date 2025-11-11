import { Portal } from "@radix-ui/react-dialog"
import { useSlide } from "./context"

/**
 * Toolbar
 */
type ToolbarProps = {
  children: React.ReactNode
}
export const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
  const { isActive } = useSlide()
  if (!isActive) return null
  return (
    <Portal>
      <div className='dark pointer-events-auto fixed bottom-24 left-1/2 z-20 flex h-min w-max -translate-x-1/2 select-none flex-col gap-0 rounded-md bg-zinc-900/80 p-1.5 text-white shadow-2xl'>
        {children}
      </div>
    </Portal>
  )
}
