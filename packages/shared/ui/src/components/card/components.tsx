import { VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@compo/utils"
import { Hn } from "../hn"
import { CardContext, useCard } from "./context"
import {
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
} from "./variants"

/**
 * CardRoot
 */
export type CardRootProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <CardContext.Provider value={{ variant }}>
        <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
      </CardContext.Provider>
    )
  }
)
CardRoot.displayName = "CardRoot"

/**
 * CardHeader
 */
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant: propVariant, ...props }, ref) => {
    const ctx = useCard()
    const variant = propVariant ?? ctx.variant
    return <div ref={ref} className={cn(cardHeaderVariants({ variant }), className)} {...props} />
  }
)
CardHeader.displayName = "CardHeader"

/**
 * CardTitle
 */
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof cardTitleVariants> & { level?: React.ComponentProps<typeof Hn>["level"] }
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, variant: propVariant, level = 3, ...props }, ref) => {
    const ctx = useCard()
    const variant = propVariant ?? ctx.variant
    return <Hn ref={ref} className={cn(cardTitleVariants({ variant }), className)} level={level} {...props} />
  }
)
CardTitle.displayName = "CardTitle"

/**
 * CardDescription
 */
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof cardDescriptionVariants>
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, variant: propVariant, ...props }, ref) => {
    const ctx = useCard()
    const variant = propVariant ?? ctx.variant
    return <p ref={ref} className={cn(cardDescriptionVariants({ variant }), className)} {...props} />
  }
)
CardDescription.displayName = "CardDescription"

/**
 * CardContent
 */
export type CardContentProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant: propVariant, ...props }, ref) => {
    const ctx = useCard()
    const variant = propVariant ?? ctx.variant
    return <div ref={ref} className={cn(cardContentVariants({ variant }), className)} {...props} />
  }
)
CardContent.displayName = "CardContent"

/**
 * CardFooter
 */
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardFooterVariants>
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant: propVariant, ...props }, ref) => {
    const ctx = useCard()
    const variant = propVariant ?? ctx.variant
    return <div ref={ref} className={cn(cardFooterVariants({ variant }), className)} {...props} />
  }
)
CardFooter.displayName = "CardFooter"

export {
  CardContent as Content,
  CardDescription as Description,
  CardFooter as Footer,
  CardHeader as Header,
  CardRoot as Root,
  CardTitle as Title,
}
