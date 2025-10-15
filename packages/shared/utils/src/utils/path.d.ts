import { Option } from "@mobily/ts-belt";
/**
 * isActivePath
 */
export declare const isActivePath: (path: string, currentPath: string, exact: boolean) => boolean;
/**
 * isActiveLocalePath
 */
export declare const isActiveLocalePath: (path: string, currentPath: string, exact: boolean) => boolean;
/**
 * stripLocalePath
 */
export declare const stripLocalePath: (path: string) => string;
/**
 * prependProtocol
 */
export declare const prependProtocol: (url: string, protocol?: string) => string;
/**
 * hasProtocol
 */
export declare const hasProtocol: (url: string) => boolean;
/**
 * makePath
 */
export declare const makePath: (...paths: string[]) => string;
/**
 * createMakePathTo
 */
export type MakePathTo = {
    (path: string, safe: true): string;
    (path: Option<string>, safe?: false): string | undefined;
};
export declare const createMakePathTo: (baseUrl?: string) => MakePathTo;
export declare const toSafeFilename: (input: string, replacement?: string) => string;
