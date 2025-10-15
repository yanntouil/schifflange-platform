"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import React from "react"
import { Button, Heading as HeadingRac } from "react-aria-components"

/**
 * Calendar header component using react-aria
 */
export const CalendarHeader: React.FC = () => {
  return (
    <header className='flex w-full items-center gap-1 pb-1'>
      <Button
        slot='previous'
        className='text-muted-foreground/80 hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 flex size-9 items-center justify-center rounded-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
      >
        <ChevronLeftIcon size={16} />
      </Button>
      <HeadingRac className='grow text-center text-sm font-medium' />
      <Button
        slot='next'
        className='text-muted-foreground/80 hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 flex size-9 items-center justify-center rounded-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
      >
        <ChevronRightIcon size={16} />
      </Button>
    </header>
  )
}
