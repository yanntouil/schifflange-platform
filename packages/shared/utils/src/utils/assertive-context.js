"use client";
import React from "react";
import { assert } from "./assert";
/**
 * Assertive context creator
 */
export const createAssertiveContext = (defaultValue) => {
    const Context = React.createContext(defaultValue);
    const useContext = () => {
        return React.useContext(Context);
    };
    const useAssertedContext = () => {
        return assert(useContext());
    };
    return {
        use: useAssertedContext,
        useAsOption: useContext,
        Provider: Context.Provider,
        Context,
    };
};
