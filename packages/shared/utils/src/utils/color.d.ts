import { Option } from "@mobily/ts-belt";
import React from "react";
/**
 * makeColorsFromString
 * helper to generate complementary background and foreground colors from a string
 */
export declare const makeColorsFromString: (string: Option<string>) => readonly [string, string];
/**
 * makeColorVarsFromString
 * helper to generate complementary background and foreground color vars from a string
 */
export declare const makeColorVarsFromString: (string: Option<string>) => React.CSSProperties;
