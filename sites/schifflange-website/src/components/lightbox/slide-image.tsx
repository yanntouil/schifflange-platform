"use client"

import Image from "next/image"
import React from "react"
import { useSlide } from "react-dia"
import { Lightbox } from "."
import { SlideImage } from "./types"
import { resolveThumbnailSrc } from "./utils"

/**
 * ImageSlide
 */
export const ImageSlide: React.FC<{ data: SlideImage }> = ({ data }) => {
  const { active } = useSlide()
  return (
    <Lightbox.Transform.Root className='relative'>
      <Lightbox.Transform.Content>
        <Image
          src={data.src}
          className='h-auto max-h-full w-auto max-w-full opacity-25 transition-opacity data-[state="active"]:opacity-100'
          data-state={active ? "active" : ""}
          alt={data.alt}
          width={data.width}
          height={data.height}
        />
      </Lightbox.Transform.Content>
      <Lightbox.Toolbar>
        <Lightbox.Zoom steps={[0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9]} />
      </Lightbox.Toolbar>
    </Lightbox.Transform.Root>
  )
}

/**
 * ImageThumbnail
 */
export const ImageThumbnail: React.FC<{ data: SlideImage }> = ({ data }) => {
  const src = resolveThumbnailSrc(data)
  if (!src) return null
  return (
    <Image
      alt={`${data.alt} - Thumbnail`}
      src={src}
      className='pointer-events-none h-full max-h-full w-auto'
      width={data.width}
      height={data.height}
    />
  )
}
