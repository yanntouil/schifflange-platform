import { generateColor } from "@marko19907/string-to-color";
/**
 * makeColorsFromString
 * helper to generate complementary background and foreground colors from a string
 */
export const makeColorsFromString = (string) => {
    const background = generateColor(string || "makeColorsFromString", {
        saturation: 90,
        lightness: 88,
    });
    const foreground = generateColor(string || "makeColorsFromString", {
        saturation: 500,
        lightness: 20,
    });
    return [background, foreground];
};
/**
 * makeColorVarsFromString
 * helper to generate complementary background and foreground color vars from a string
 */
export const makeColorVarsFromString = (string) => {
    const background = generateColor(string || "makeColorsFromString", {
        saturation: 90,
        lightness: 88,
    });
    const foreground = generateColor(string || "makeColorsFromString", {
        saturation: 500,
        lightness: 20,
    });
    return { "--background": background, "--foreground": foreground };
};
