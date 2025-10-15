import { generateColor } from "@marko19907/string-to-color"
import { Option } from "@mobily/ts-belt"
import React from "react"

/**
 * makeColorsFromString
 * helper to generate complementary background and foreground colors from a string
 */
export const makeColorsFromString = (string: Option<string>) => {
  const background = generateColor(string || "makeColorsFromString", {
    saturation: 90,
    lightness: 88,
  })
  const foreground = generateColor(string || "makeColorsFromString", {
    saturation: 500,
    lightness: 20,
  })

  return [background, foreground] as const
}

/**
 * makeColorVarsFromString
 * helper to generate complementary background and foreground color vars from a string
 */
export const makeColorVarsFromString = (string: Option<string>) => {
  const background = generateColor(string || "makeColorsFromString", {
    saturation: 90,
    lightness: 88,
  })
  const foreground = generateColor(string || "makeColorsFromString", {
    saturation: 500,
    lightness: 20,
  })

  return { "--background": background, "--foreground": foreground } as React.CSSProperties
}
