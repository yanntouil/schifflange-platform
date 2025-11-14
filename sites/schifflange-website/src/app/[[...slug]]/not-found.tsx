"use client"

import { Ui } from "@/components/ui"
import { useTranslation } from "@/lib/localize"

/**
 * NotFound page
 */
const NotFound = () => {
  const { _ } = useTranslation(dictionary)

  return (
    <div className='pt-56 pb-16 flex items-center justify-center'>
      <div className='max-w-md text-center text-foreground'>
        <div className='mb-4'>
          <h1 className='text-9xl font-bold text-primary'>404</h1>
        </div>
        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>{_("title")}</h2>
        <p className='mb-8 text-sm'>{_("description")}</p>
        <Ui.Button asChild>
          <Ui.Link href='/'>{_("link")}</Ui.Link>
        </Ui.Button>
      </div>
    </div>
  )
}
export default NotFound
/**
 * translations
 */
const dictionary = {
  en: {
    title: "Page not found",
    description: "Sorry, we couldn't find the page you're looking for.",
    link: "Go back home",
  },
  fr: {
    title: "Page non trouvée",
    description: "Désolé, nous n'avons pas trouvé la page que vous cherchez.",
    link: "Retour à l'accueil",
  },
  de: {
    title: "Seite nicht gefunden",
    description: "Entschuldigung, wir konnten die Seite nicht finden, die Sie suchen.",
    link: "Zurück zur Startseite",
  },
  lb: {
    title: "Säit net fonnt",
    description: "Entschuldigung, wir konnten die Seite nicht finden, die Sie suchen.",
    link: "Zeréck op d'Startsäit",
  },
}
