import { service } from "@/services"
import { LanguagesServiceProvider } from "@compo/languages"
import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { DashboardServiceProvider } from "@services/dashboard"
import React from "react"

/**
 * provider
 */
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { _ } = useTranslation(dictionary)
  const isReady = service.useStore((state) => state.isReady)
  React.useEffect(() => {
    if (isReady) return
    const interval = setInterval(async () => {
      setOnRetry(true)
      const isReady = await service.check()
      setOnRetry(false)
      if (isReady) clearInterval(interval)
    }, 5000)
    return () => clearInterval(interval)
  }, [isReady])

  const [onRetry, setOnRetry] = React.useState(false)
  const retry = async () => {
    setOnRetry(true)
    await service.check()
    setOnRetry(false)
  }
  const reload = () => {
    window.location.reload()
  }

  const retryRef = React.useRef<Icon.RadioIconHandle>(null)
  const reloadRef = React.useRef<Icon.RefreshCWIconHandle>(null)
  return (
    <DashboardServiceProvider service={service}>
      <LanguagesServiceProvider service={service.languages}>
        {isReady ? children : null}

        <Ui.Alert.Root open={!isReady}>
          <Ui.Alert.Content>
            <Ui.Alert.Header>
              <Ui.Alert.Title>{_("title")}</Ui.Alert.Title>
              <Ui.Alert.Description>{_("description")}</Ui.Alert.Description>
            </Ui.Alert.Header>
            <Ui.Alert.Footer>
              <Ui.Alert.Action
                onClick={reload}
                variant="ghost"
                onMouseEnter={() => reloadRef.current?.startAnimation()}
                onMouseLeave={() => reloadRef.current?.stopAnimation()}
              >
                <Icon.RefreshCWIcon ref={reloadRef} />
                {_("reload")}
              </Ui.Alert.Action>
              <Ui.Alert.Action
                onClick={retry}
                disabled={onRetry}
                onMouseEnter={() => retryRef.current?.startAnimation()}
                onMouseLeave={() => retryRef.current?.stopAnimation()}
              >
                {onRetry ? (
                  <Icon.Loader variant="round" size="sm" role="status" aria-label={_("loading")} />
                ) : (
                  <Icon.RadioIcon ref={retryRef} />
                )}
                {_("retry")}
              </Ui.Alert.Action>
            </Ui.Alert.Footer>
          </Ui.Alert.Content>
        </Ui.Alert.Root>
      </LanguagesServiceProvider>
    </DashboardServiceProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Services is down",
    description: "Please wait while we check the services",
    retry: "Retry",
    loading: "Loading",
    reload: "Reload page",
  },
  fr: {
    title: "Services est en panne",
    description: "Veuillez patienter pendant que nous vérifions les services",
    retry: "Réessayer",
    loading: "Chargement en cours",
    reload: "Recharger la page",
  },
  de: {
    title: "Dienste sind nicht verfügbar",
    description: "Bitte warten Sie, während wir die Dienste überprüfen",
    retry: "Erneut versuchen",
    loading: "Wird geladen",
    reload: "Seite neu laden",
  },
}
