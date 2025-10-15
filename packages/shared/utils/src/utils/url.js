import { prependHttp } from "./string";
/**
 * Check if the url is valid
 */
export const isUrlValid = (url) => {
    try {
        // Attempt to create a new URL object
        const parsedUrl = new URL(prependHttp(url));
        // Regex to ensure the domain has at least one '.' for a TLD
        return /\.[a-z]{2,}$/.test(parsedUrl.hostname);
    }
    catch (e) {
        // Catch any errors that occur if the URL is invalid
        return false;
    }
};
/**
 * Pretty print a URL
 */
export const prettyPrintUrl = (url) => {
    try {
        const parsedUrl = new URL(prependHttp(url));
        return parsedUrl.hostname;
    }
    catch (e) {
        return url;
    }
};
import { D, G } from "@mobily/ts-belt";
/**
 * convert params to query string and append to path
 */
export const appendQS = (path, query) => {
    if (typeof query !== "object" || query === null)
        return path;
    const parsedQuery = D.map(query, (row) => G.isString(row) || G.isNumber(row) ? `${row}` : JSON.stringify(row));
    if (D.isEmpty(parsedQuery))
        return path;
    const qs = new URLSearchParams(parsedQuery).toString();
    return path + "?" + qs;
};
/**
 * convert params to query string
 */
export const makeQS = (query) => {
    if (typeof query !== "object" || query === null)
        return "";
    const parsedQuery = D.map(query, (row) => G.isString(row) || G.isNumber(row) ? `${row}` : JSON.stringify(row));
    if (D.isEmpty(parsedQuery))
        return "";
    return new URLSearchParams(parsedQuery).toString();
};
