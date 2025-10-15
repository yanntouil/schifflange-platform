import { D } from "@mobily/ts-belt";
/**
 * matchSize
 * match a size to a value
 */
export const matchSize = (size, values) => {
    const sizeValue = size ?? "default";
    return D.get(values, sizeValue) ?? "";
};
