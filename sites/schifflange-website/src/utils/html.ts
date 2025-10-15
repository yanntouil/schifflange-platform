import { LocalizeLanguage } from '@/lib/localize'
import { pipe } from '@mobily/ts-belt'
import * as cheerio from 'cheerio'

/**
 * Rebase headings in HTML string
 */

export const rebaseHeadings = (html: string, base: number) => {
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser)
    console.warn(
      'rebaseHeadings() was used on the client side, only use it in ssr to avoid including cheerio in client bundle.'
    )

  const $ = cheerio.load(html)

  $('h1,h2,h3,h4,h5,h6').each((_, el) => {
    const currentLevel = parseInt(el.tagName[1])
    const newLevel = Math.min(6, Math.max(1, currentLevel + (base - 1))) // clamp 1-6

    const $newHeading = $(`<h${newLevel}>`).html($(el).html()!)
    $newHeading.attr('data-visually', 'h' + currentLevel)

    $(el).replaceWith($newHeading)
  })

  return $.html()
}

/**
 * Replace normal spaces before French punctuation marks
 * (like ":", ";", "?", "!", "%", "»") with narrow non-breaking spaces (\u202F)
 * to prevent unwanted line breaks.
 *
 * Example:
 *   noWrapPunctuation("Titre : question ? Oui !")
 *   → "Titre : question ? Oui !"  (with non-breaking narrow spaces)
 */

export const noWrapPunctuation = (text: string) => {
  if (typeof text !== 'string') return text

  // Regex: capture space(s) before : ; ? ! % »
  return text.replace(/\s([:;?!%»])/g, '\u202F$1')
}

/**
 * Apply all text formating
 */

export const applyTextFormating = (text: string) => {
  return noWrapPunctuation(text)
}
