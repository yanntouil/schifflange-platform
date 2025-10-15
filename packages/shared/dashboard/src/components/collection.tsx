import { cxm, D } from "@compo/utils"
import { DismissableLayer, DismissableLayerProps } from "@radix-ui/react-dismissable-layer"
import { VariantProps } from "class-variance-authority"
import React from "react"
import { CollectionContext } from "./collection.context"
import { collectionVariants } from "./collection.variants"

export type CollectionViewType = NonNullable<VariantProps<typeof collectionVariants>["view"]>
export type OnPointerDownOutside = DismissableLayerProps["onPointerDownOutside"]
export type CollectionProps = DismissableLayerProps & {
  container?: string
  group?: string
  classNames?: {
    card?: string
    row?: string
  }
} & VariantProps<typeof collectionVariants>
const Collection: React.FC<CollectionProps> = ({
  className,
  container = "@container/collection",
  group = "group-items",
  view = "row",
  classNames,
  ...props
}) => (
  <CollectionContext.Provider value={{ view }}>
    {D.isEmpty(D.selectKeys(props, dismissableLayerProps)) ? (
      <div
        className={cxm(container, group, collectionVariants({ view }), view && classNames?.[view], className)}
        {...props}
      />
    ) : (
      <DismissableLayer className={cxm(container, group, collectionVariants({ view }), className)} {...props} />
    )}
  </CollectionContext.Provider>
)

export { Collection }

/**
 * dismissableLayerProps
 */
const dismissableLayerProps = [
  "disableOutsidePointerEvents",
  "onEscapeKeyDown",
  "onPointerDownOutside",
  "onFocusOutside",
  "onInteractOutside",
  "onDismiss",
] as const
