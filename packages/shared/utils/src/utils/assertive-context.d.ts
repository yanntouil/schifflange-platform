import React from "react";
/**
 * Assertive context creator
 */
export declare const createAssertiveContext: <V>(defaultValue?: V) => {
    use: () => V & {};
    useAsOption: () => V | undefined;
    Provider: React.Provider<V | undefined>;
    Context: React.Context<V | undefined>;
};
export type InferContext<C> = C extends {
    use: () => infer U;
} ? U : never;
