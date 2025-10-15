import { DeepPartial as DeepPartialE, Head as HeadE, MarkOptional as MarkOptionalE, MarkRequired as MarkRequiredE, Merge as MergeE, MergeN as MergeNE, Tail as TailE } from "ts-essentials";
export {};
/**
 * Utility types
 */
export type Nullable<V> = V | null;
export type ActiveNullable<V> = {
    active: V | null;
};
export type ById<L extends {
    id: string;
}, R = void> = {
    [key: string]: R extends void ? L : R;
};
export type Identity<T> = {
    [K in keyof T]: T[K];
};
export type Endo<V> = (v: V) => V;
export type Predicate<V> = (v: V) => boolean;
export type Argless = () => void;
export type Argfull = (...args: unknown[]) => void;
export type Effect = () => void;
export type ArgEffect = (...args: unknown[]) => void;
export type UnknownFunction = (...args: ImplicitAny[]) => ImplicitAny;
export type Methods<T> = {
    [K in keyof T]: T[K] extends UnknownFunction ? Awaited<ReturnType<T[K]>> : Methods<T[K]>;
};
export type Future<V> = Promise<V> | V;
export type Falsy = false | 0 | "" | null | undefined;
export type Primitive = null | undefined | string | number | boolean | symbol;
export type UnknownRecord = Record<keyof ImplicitAny, unknown>;
export type TimeoutRef = ReturnType<typeof setTimeout>;
export type IntervalRef = ReturnType<typeof setInterval>;
export type DeepPartial<X> = DeepPartialE<X>;
export type Merge<X, Y> = MergeE<X, Y>;
export type MergeN<XS extends readonly ImplicitAny[]> = MergeNE<XS>;
export type Head<X extends unknown[]> = HeadE<X>;
export type Tail<X extends unknown[]> = TailE<X>;
export type MarkOptional<T, K extends keyof T = keyof T> = MarkOptionalE<T, K>;
export type MarkRequired<T, K extends keyof T = keyof T> = MarkRequiredE<Partial<T>, K>;
export type Specify<T, K extends keyof T = keyof {}> = MarkRequired<T, K>;
export type MarkOnlyRequired<T, K extends keyof T = keyof T> = MarkRequiredE<T, K>;
export type Indexed<V> = V & {
    index: number;
};
export type Props<Fn extends UnknownFunction> = LastParameter<Fn>;
export type SpecifyProps<Fn extends UnknownFunction, T = Props<Fn>, K extends keyof T = keyof {}> = Specify<Props<Fn> & T, K>;
export type DistributeSpecify<U, K extends keyof U> = U extends any ? Specify<U, K> : never;
export type Last<T extends ImplicitAny[]> = T extends [...infer _, infer L] ? L : T extends [...infer _, (infer L)?] ? L | undefined : never;
export type LastParameter<F extends (...args: ImplicitAny) => ImplicitAny> = Last<Parameters<F>>;
export type ImplicitAny = any;
export type As<T> = T extends object ? {
    [K in keyof T]: As<T[K]>;
} : T;
export type Of<V> = V | V[];
/**
 * Maths
 */
export type Size = {
    width: number;
    height: number;
};
/**
 * Makers
 */
export type Maker<Type extends Record<string, any> = Record<string, any>, Values = Partial<Type>, Config = {}> = (values: Values, config?: Config) => Type;
export type MakerValues<M extends (...args: any[]) => any> = Parameters<M>[0];
/**
 * NonNullableRecord
 */
export type NonNullableRecord<T extends Record<string, unknown>> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};
