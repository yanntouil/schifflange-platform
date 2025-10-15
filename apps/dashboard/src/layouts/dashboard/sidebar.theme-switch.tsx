import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { cx } from "class-variance-authority"
import React from "react"
import "./sidebar.theme-switch.css"

/**
 * SidebarThemeSwitch
 * this is the theme switch for the sidebar
 */
export const SidebarThemeSwitch: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { scheme, setTheme } = Ui.useTheme()
  const id = React.useId()
  const { open, state } = Ui.useSidebar()
  const [isChanging, setIsChanging] = React.useState(false)
  const buttonRef = React.useRef<HTMLLabelElement>(null)

  const handleThemeChange = React.useCallback(
    async (value: boolean) => {
      if (open) return setTheme(value ? "dark" : "light")
      if (!buttonRef.current || isChanging) return

      const rect = buttonRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // create the wave element
      const wave = document.createElement("div")
      wave.className = "theme-wave"
      wave.style.setProperty("--wave-x", `${x}px`)
      wave.style.setProperty("--wave-y", `${y}px`)
      wave.style.setProperty("--wave-color", value ? "var(--foreground)" : "var(--background)")
      document.body.appendChild(wave)

      // trigger the animation
      setIsChanging(true)
      setTheme(value ? "dark" : "light")

      // clean up after the animation
      wave.addEventListener("animationend", () => {
        wave.remove()
        setIsChanging(false)
      })
    },
    [setTheme, isChanging, open]
  )

  const sunIconRef = React.useRef<Icon.SunHandle>(null)
  const moonIconRef = React.useRef<Icon.MoonHandle>(null)
  return (
    <Ui.Sidebar.MenuItem>
      <Ui.Sidebar.MenuButton
        asChild
        tooltip={_(scheme === "dark" ? "light" : "dark")}
        disabled={isChanging}
        className={cx(isChanging && "cursor-not-allowed opacity-50")}
      >
        <label
          ref={buttonRef}
          htmlFor={id}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs whitespace-nowrap [&>*]:shrink-0"
          onMouseEnter={() => {
            sunIconRef.current?.startAnimation()
            moonIconRef.current?.startAnimation()
          }}
          onMouseLeave={() => {
            sunIconRef.current?.stopAnimation()
            moonIconRef.current?.stopAnimation()
          }}
        >
          <span
            className={cx(
              "relative inline-block size-4",
              "[&>div]:absolute [&>div]:inset-0 [&>div]:size-full [&>div]:transform [&>div]:stroke-[2.5] [&>div]:transition-all [&>div]:duration-800 [&>div]:ease-in-out"
            )}
            aria-hidden
          >
            <Icon.Sun ref={sunIconRef} className={cx(scheme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0")} />
            <Icon.Moon ref={moonIconRef} className={cx(scheme === "light" ? "-rotate-90 opacity-0" : "rotate-0 opacity-100")} />
          </span>
          <span className={cx(!open && "sr-only")}>{_("label")}</span>
          <Ui.Switch
            size="sm"
            id={id}
            className={cx(!open && "sr-only")}
            checked={scheme === "dark"}
            onCheckedChange={handleThemeChange}
            disabled={isChanging}
          />
        </label>
      </Ui.Sidebar.MenuButton>
    </Ui.Sidebar.MenuItem>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    label: "Mode sombre",
    light: "Passer au mode clair",
    dark: "Passer au mode sombre",
  },
  en: {
    label: "Dark mode",
    light: "Switch to light mode",
    dark: "Switch to dark mode",
  },
  de: {
    label: "Dunkler Modus",
    light: "Zum hellen Modus wechseln",
    dark: "Zum dunklen Modus wechseln",
  },
}
