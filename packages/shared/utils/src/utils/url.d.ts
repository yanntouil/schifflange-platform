/**
 * Check if the url is valid
 */
export declare const isUrlValid: (url: string) => boolean;
/**
 * Pretty print a URL
 */
export declare const prettyPrintUrl: (url: string) => string;
/**
 * convert params to query string and append to path
 */
export declare const appendQS: (path: string, query: unknown) => string;
/**
 * convert params to query string
 */
export declare const makeQS: (query: unknown) => string;
