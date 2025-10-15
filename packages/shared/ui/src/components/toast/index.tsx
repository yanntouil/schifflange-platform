import { Portal } from "@radix-ui/react-portal"
import { CheckCircle, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react"
import React from "react"
import { Toaster as Sonner } from "sonner"
import { useTheme } from "../themes"
export { toast } from "sonner"

/**
 * Toaster
 */
export const Toaster: React.FC = () => {
  const { scheme } = useTheme()
  return (
    <Portal>
      <Sonner
        theme={scheme}
        className='toaster group'
        icons={{
          success: <CheckCircle className='size-4' aria-hidden />,
          info: <Info className='size-4' aria-hidden />,
          warning: <TriangleAlert className='size-4' aria-hidden />,
          error: <OctagonX className='size-4' aria-hidden />,
          loading: <LoaderCircle className='size-4 animate-spin' aria-hidden />,
        }}
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-md",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            error: "text-destructive",
            success: "text-success",
            warning: "text-foreground",
            info: "text-foreground",
            closeButton:
              "!absolute !right-1 !top-1 !left-auto !transform-none !h-5 !w-5 !border-transparent hover:!border-border hover:!bg-muted !text-muted-foreground",
          },
        }}
      />
    </Portal>
  )
}
/*
[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button] {
    background: var(--normal-bg);
    border-color: var(--normal-border);
    color: var(--normal-text);
}
[data-sonner-toast][data-styled=true] [data-close-button] {
    position: absolute;
    left: var(--toast-close-button-start);
    right: var(--toast-close-button-end);
    top: 0;
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    color: var(--gray12);
    background: var(--normal-bg);
    border: 1px solid var(--gray4);
    transform: var(--toast-close-button-transform);
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;
    transition: opacity .1s, background .2s, border-color .2s;
}
<button aria-label="Close toast" data-disabled="false" data-close-button="true" class="group-[.toast]:bg-muted group-[.toast]:text-muted-foreground absolute right-2 top-2"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
*/
