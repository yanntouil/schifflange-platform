import { AvailableItemTypes } from "@contents/schifflange-website/ssr"
import contentsRichText from "./contents/rich-text"

/**
 * registry items
 */
const items = {
  "contents-rich-text": contentsRichText,
} satisfies Record<AvailableItemTypes, unknown>
export default items
