/*
|--------------------------------------------------------------------------
| path utils
|--------------------------------------------------------------------------
|
| The path utils is used for defining the HTTP routes.
|
*/
import { A, G, S, pipe } from "@mobily/ts-belt";
import { assert } from "./assert";
/**
 * isActivePath
 */
export const isActivePath = (path, currentPath, exact) => {
    if (exact)
        return path === currentPath;
    return S.startsWith(currentPath, path);
};
/**
 * isActiveLocalePath
 */
export const isActiveLocalePath = (path, currentPath, exact) => {
    if (exact)
        return path === stripLocalePath(currentPath);
    return S.startsWith(stripLocalePath(currentPath), path);
};
/**
 * stripLocalePath
 */
export const stripLocalePath = (path) => {
    if (!path)
        return `/`;
    return "/" + pipe(path, S.split("/"), A.sliceToEnd(2), A.join("/"));
};
/**
 * prependProtocol
 */
export const prependProtocol = (url, protocol = "https://") => {
    const supportedProtocols = ["http://", "https://", "ftp://", "sftp://"];
    if (!supportedProtocols.some((p) => url.startsWith(p))) {
        return protocol + url;
    }
    return url;
};
/**
 * hasProtocol
 */
export const hasProtocol = (url) => {
    const supportedProtocols = ["http://", "https://", "ftp://", "sftp://"];
    return supportedProtocols.some((p) => url.startsWith(p));
};
/**
 * makePath
 */
export const makePath = (...paths) => {
    const trimmedPaths = paths.map((path) => path.replace(/^\/|\/$/g, ""));
    return trimmedPaths.join("/");
};
// Factory
export const createMakePathTo = (baseUrl) => {
    const makePathTo = (path, safe = false) => {
        const url = baseUrl ?? "";
        if (safe)
            return makePath(assert(url), path);
        return G.isNotNullable(path) ? makePath(assert(url), path) : undefined;
    };
    return makePathTo;
};
/**
 * toSafeFilename
 */
const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
const windowsTrailingRe = /[\. ]+$/;
export const toSafeFilename = (input, replacement = "_") => {
    const base = input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsTrailingRe, replacement);
    // évite les noms réservés type "con", "nul", etc.
    if (windowsReservedRe.test(base))
        return base + replacement;
    return base;
};
