/**
 * byId
 * transform an array of items into an object by their id
 */
export declare const byId: <L extends {
    id: string;
}, R = void>(items: L[], localize?: (item: L) => R) => {
    [key: string]: R extends void ? L : R;
};
