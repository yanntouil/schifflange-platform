import { Option } from "@mobily/ts-belt";
/**
 * localeCompare
 */
export declare const localeCompare: (a: string, b: string) => number;
/**
 * Pads a string value with leading zeroes until length is reached
 * @example zeroPad(8, 3) => "008"
 */
export declare const zeroPad: (value: string | number, length?: number) => string;
/**
 * prependHttp
 */
export declare const prependHttp: (url: string, https?: boolean) => string;
/**
 * string conversion
 */
export declare const camelToSnake: (str: string) => string;
export declare const camelToKebab: (str: string) => string;
export declare const camalize: (string: string) => string;
/**
 * remove https
 */
export declare const readableURL: (str: string) => string;
/**
 * capitalize the first character of a string
 */
export declare const capitalize: (s: string) => string;
/**
 * alias of capitalize for php old school developers :)
 */
export declare const ucFirst: (s: string) => string;
/**
 * pluralize
 */
export declare const pluralize: (n: number, word: string, none?: string, replace?: boolean) => string | undefined;
/**
 * incrementName
 */
export declare const incrementName: (name: string, existingNames: string[]) => string;
/**
 * makeBreakable
 */
export declare const makeBreakable: (str: string, interval?: number) => string;
/**
 * truncateText
 */
export declare const truncateText: (text: string, maxLength: number) => string;
/**
 * truncateMiddle
 */
export declare const truncateMiddle: (text: string, maxLength: number) => string;
/**
 * return a placeholder if the value is empty
 */
export declare const placeholder: <T extends string | undefined, U extends string | undefined>(value: U, placeholder?: T) => U | (T extends undefined ? null : T);
/**
 * slugify
 */
export declare const slugify: (value: string) => string;
/**
 * oneIsNotEmpty
 * Check if at least one string is not empty
 */
export declare const oneIsNotEmpty: (...strings: Option<string>[]) => boolean;
/**
 * isNotEmptyString
 * Check if a string is not an empty
 */
export declare const isNotEmptyString: (s: Option<string>) => s is string;
/**
 * everyAreNotEmpty
 * Check if all strings are not empty
 */
export declare const everyAreNotEmpty: (...strings: Option<string>[]) => boolean;
/**
 * stripHtml
 * Remove HTML tags from a string
 */
export declare const stripHtml: (s: string) => string;
export declare const getInitials: (firstName: string, lastName: string, maxLength?: number) => string;
