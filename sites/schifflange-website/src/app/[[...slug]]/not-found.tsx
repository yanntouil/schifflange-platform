import { getServerTranslation } from "@/utils/localize"
import { matchLanguage } from "@compo/localize"
import { headers } from "next/headers"
import Link from "next/link"

const NotFound = async () => {
  const headersList = headers()
  const raw = headersList.get("x-detected-language") ?? undefined
  const locale = matchLanguage(raw)
  const { _ } = getServerTranslation(locale, dictionary)

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md text-center text-[#1D1D1B]'>
        <div className='mb-4'>
          <h1 className='text-9xl font-bold text-[#626A4F]'>404</h1>
        </div>

        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>{_("title")}</h2>

        <p className='mb-8 text-sm'>{_("description")}</p>

        <Link
          href={`/${locale}`}
          className='inline-flex items-center px-6 py-4 bg-[#98C5D5] text-[#1D1D1B] font-medium text-[12px] leading-normal rounded-[8px] transition-colors'
        >
          {_("link")}
        </Link>
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
}
