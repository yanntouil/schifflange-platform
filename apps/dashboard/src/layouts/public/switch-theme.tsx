import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * SwitchTheme
 */
export const SwitchTheme: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { scheme, setTheme } = Ui.useTheme()
  const isLight = scheme === "light"
  const switchTo = isLight ? "dark" : "light"
  return (
    <Ui.Button variant="ghost" onClick={() => setTheme(switchTo)} icon size="sm">
      <Ui.SrOnly>{_(`switch-${switchTo}`)}</Ui.SrOnly>
      <span
        className="shadow-[inset_calc(var(--size)*0.33)_calc(var(--size)*-0.25) 0] size-[var(--size)] appearance-none rounded-full transition-all duration-500"
        style={{ ...vars, ...(isLight ? sunStyle : moonStyle) }}
        aria-hidden
      />
    </Ui.Button>
  )
}

const vars = {
  "--size": "calc(var(--spacing)*4)",
  "--ray-size": "calc(var(--size) * -0.4)",
  "--offset-orthogonal": "calc(var(--size) * 0.65)",
  "--offset-diagonal": "calc(var(--size) * 0.45)",
} as React.CSSProperties
const moonStyle = {
  boxShadow: "inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0",
  color: "hsl(240, 38.27160493827161%, 68.23529411764706%)",
} as React.CSSProperties

const sunStyle = {
  transform: "scale(0.75)",
  color: "hsl(40, 100%, 50%)",
  boxShadow: `inset 0 0 0 var(--size),calc(var(--offset-orthogonal)*-1) 0 0 var(--ray-size),var(--offset-orthogonal) 0 0 var(--ray-size),0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size),0 var(--offset-orthogonal) 0 var(--ray-size),calc(var(--offset-diagonal)*-1) calc(var(--offset-diagonal)*-1) 0 var(--ray-size),var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size),calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size),var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size)`,
} as React.CSSProperties

/**
 * translations
 */
const dictionary = {
  fr: {
    "switch-light": "Passer du mode sombre au clair",
    "switch-dark": "Passer du mode clair au sombre",
  },
  en: {
    "switch-light": "Switch from dark to light mode",
    "switch-dark": "Switch from light to dark mode",
  },
  de: {
    "switch-light": "Vom dunklen zum hellen Modus wechseln",
    "switch-dark": "Vom hellen zum dunklen Modus wechseln",
  },
}
