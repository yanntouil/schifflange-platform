import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { ImageOff } from "lucide-react"
import React from "react"
import { cxm, G, Option } from "@compo/utils"

/**
 * ImageRoot
 */
export type ImageRootProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
const ImageRoot = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, ImageRootProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cxm("shrink-0 overflow-hidden", className)} {...props} />
  )
)
ImageRoot.displayName = "ImageRoot"

/**
 * ImageSource
 */
export type ImageSourceProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
const ImageSource = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, ImageSourceProps>(
  ({ className, ...props }, ref) => <AvatarPrimitive.Image ref={ref} className={cxm("", className)} {...props} />
)
ImageSource.displayName = "ImageSource"

/**
 * ImageFallback
 */
export type ImageFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
const ImageFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, ImageFallbackProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cxm("flex items-center justify-center bg-muted/10", className)}
      {...props}
    />
  )
)
ImageFallback.displayName = "ImageFallback"

/**
 * Image
 */
export type ImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  children?: React.ReactNode
  src?: Option<string>
  preview?: Option<string>
  classNames?: {
    wrapper?: string
    image?: string
    fallback?: string
  }
}
export type ImageRef = React.ElementRef<typeof AvatarPrimitive.Image>
const ImageComponent = React.forwardRef<ImageRef, ImageProps>(
  ({ children, style, className, src, preview, classNames, ...props }, ref) => {
    // const [imageSrc, setImageSrc] = React.useState<Option<string>>(preview || src)
    // React.useEffect(() => {
    //   if (G.isNullable(src) || G.isNullable(preview)) return
    //   const image = new Image()
    //   image.src = src
    //   image.onload = () => setImageSrc(src)
    // }, [src, preview])

    return (
      <ImageRoot className={cxm(classNames?.wrapper)}>
        {G.isNotNullable(src) && (
          <ImageSource ref={ref} {...props} src={src} className={cxm(classNames?.image, className)} style={style} />
        )}
        <ImageFallback className={cxm(classNames?.fallback, className)} style={style}>
          {children}
        </ImageFallback>
      </ImageRoot>
    )
  }
)
const ImageEmpty = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, ImageSourceProps>(
  ({ className, ...props }, ref) => (
    <ImageOff className={cxm("h-16 max-h-[24%] w-16 max-w-[24%] stroke-[3%]", className)} aria-hidden />
  )
)
ImageEmpty.displayName = "ImageEmpty"

export { ImageComponent as Image, ImageEmpty, ImageFallback, ImageRoot, ImageSource }
