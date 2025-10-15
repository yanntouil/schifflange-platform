import { A, D } from "@mobily/ts-belt";
/**
 * byId
 * transform an array of items into an object by their id
 */
export const byId = (items, localize) => A.reduce(items, {}, (items, item) => D.set(items, item.id, localize ? localize(item) : item));
