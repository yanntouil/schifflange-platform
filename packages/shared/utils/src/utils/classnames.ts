import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
export const cx = (...inputs: ClassValue[]) => clsx(inputs)
export const cxm = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
