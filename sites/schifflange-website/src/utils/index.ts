import { config } from "@/config"
import { assert, G, makePath, type Option } from "@compo/utils"

/**
 * makePathToApp
 * make a path to the current next application
 */
export function makePathToApp(path: string, safe: true): string
export function makePathToApp(path: Option<string>, safe?: false): string | undefined
export function makePathToApp(path: Option<string>, safe?: boolean): string | undefined
export function makePathToApp(path: string | Option<string>, safe: boolean = false): string | undefined {
  if (safe) return makePath(assert(config.app), path as string)
  else return G.isNotNullable(path) ? makePath(assert(config.app), path as string) : undefined
}
