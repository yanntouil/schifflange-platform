import { cva } from "@compo/utils"

/**
 * this variant is used to make collection grid or list
 */
export const collectionVariants = cva([""], {
  variants: {
    view: {
      row: "",
      card: "",
    },
  },
  defaultVariants: {
    view: "row",
  },
})

/**
 * this variant is used to make collection grid of cards
 */
export const collectionCards = cva([
  "grid grid-cols-1 @xl/dashboard:grid-cols-2 @4xl/dashboard:grid-cols-3 @6xl/dashboard:grid-cols-4 @7xl/dashboard:grid-cols-5 gap-4",
])

/**
 * this variant is used to make the item span the full width of the container. usefull for toolbar, pagination, etc.
 */
export const collectionFullSpanVariants = cva([""], {
  variants: {
    view: {
      row: "",
      card: "col-span-1 @xl/dashboard:col-span-2 @4xl/dashboard:col-span-3 @6xl/dashboard:col-span-4 @7xl/dashboard:col-span-5",
    },
  },
  defaultVariants: {
    view: "row",
  },
})
