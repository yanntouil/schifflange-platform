import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs) => twMerge(clsx(inputs));
export const cx = (...inputs) => clsx(inputs);
export const cxm = (...inputs) => twMerge(clsx(inputs));
