'use client'

import IconPlayback from '@/assets/playback.svg'
import { useContainerSize, useTimeout } from '@compo/hooks'
import { Option } from '@compo/utils'
import { cx } from 'class-variance-authority'
import React from 'react'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

/**
 * Video
 */
export const Video = ({
  url,
  className,
  controls = true,
}: {
  url: Option<string>
  className?: string
  controls?: boolean
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useContainerSize(ref as React.RefObject<HTMLElement>)
  const { width, height } = React.useMemo(() => {
    return {
      width: Math.round(size.width),
      height: Math.round(size.width * 0.5625),
    }
  }, [size.width])

  const [mounted, setMounted] = React.useState(false)
  useTimeout(() => setMounted(true), 50)
  if (!url) return null

  return (
    <div className='isolate'>
      <div className='relative'>
        <div
          ref={ref}
          className={cx('aspect-video max-h-full w-full max-w-full overflow-hidden', className)}
          aria-hidden
        />

        <div
          className={cx('absolute inset-x-0 top-0 aspect-video w-full overflow-hidden', className)}
        >
          {mounted && (
            <ReactPlayer
              url={url}
              width={width}
              height={height}
              stopOnUnmount
              fallback={<p>test</p>}
              controls
              playIcon={
                <div className='absolute bottom-[12px] right-[12px] size-14 icons:size-7 flex items-center justify-center rounded-full bg-white'>
                  <IconPlayback />
                </div>
              }
              light={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
