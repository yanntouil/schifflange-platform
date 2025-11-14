import { Ui } from "@/components/ui"
import { LocalizeLanguage } from "@/lib/localize"
import { getServerTranslation } from "@/utils/localize"
import { cxm } from "@compo/utils"
import { Container } from "./container"
import { Wrapper } from "./wrapper"

/**
 * municipality website link
 */
const copyrightLinks = "https://schifflange.lu"

/**
 * footer copyright
 * the footer copyright of the page with the copyright year, the municipality name
 */
type FooterProps = {
  lang: LocalizeLanguage
}
export const FooterCopyright: React.FC<FooterProps> = ({ lang }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  const year = new Date().getFullYear()
  return (
    <Wrapper className='bg-white py-4'>
      <Container className='flex @3xl/wrapper:flex-row flex-col justify-between gap-x-10 gap-y-4 items-center'>
        <p className='text-muted-foreground text-xs font-normal'>
          {_("copyright", { year })}{" "}
          <a
            href={copyrightLinks}
            target='_blank'
            rel='noopener noreferrer nofollow'
            className={Ui.variants.link({ color: "default" })}
          >
            {_("copyright-name")}
          </a>{" "}
          {_("copyright-all")}
        </p>

        <a href='https://101.lu' target='_blank' rel='noopener noreferrer nofollow' className='relative group block'>
          <div
            className='animated-gradient-ring opacity-0 group-hover:opacity-100 group-focus:opacity-100'
            aria-hidden
          />
          <span
            className={cxm(
              "flex items-center gap-2 relative rounded-full px-4 py-1.5",
              "bg-white text-muted-foreground",
              "group-hover:text-white group-focus:text-white group-hover:bg-neutral-800 group-focus:bg-neutral-800",
              "transition-colors duration-300 ease-in-out"
            )}
          >
            <span className='text-xs font-medium'>{_("powered-101")}</span>
            <Ui.Separator orientation='vertical' className='h-4' />
            <Logo101Studios className='w-8' />
          </span>
        </a>
      </Container>
    </Wrapper>
  )
}

const Logo101Studios = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 64 20' {...props}>
    <path d='M6.612.309-.001 5.883v7.736l6.613-5.557V20h7.428V.309H6.612ZM64 20V.309h-7.428l-6.63 5.574v7.736l6.63-5.557V20H64ZM44.747 20v-8.285C44.747 4.202 39.038 0 32.408 0c-6.63 0-12.392 4.202-12.392 11.715V20h7.428v-8.182c0-3.31 2.056-5.369 4.964-5.369 2.907 0 4.91 2.042 4.91 5.37V20h7.43Z' />
  </svg>
)
/**
 * translations
 */
const dictionary = {
  en: {
    copyright: "Copyright © {{year}}",
    "copyright-all": "All rights reserved",
    "copyright-name": "Municipality of Schifflange",
    "powered-101": "Powered by 101 Studios",
  },
  fr: {
    copyright: "Copyright © {{year}}",
    "copyright-all": "Tous droits réservés",
    "copyright-name": "Commune de Schifflange",
    "powered-101": "Réalisé par 101 Studios",
  },
  de: {
    copyright: "Copyright © {{year}}",
    "copyright-all": "Alle Rechte vorbehalten",
    "copyright-name": "Gemeinde Schifflingen",
    "powered-101": "Entwickelt von 101 Studios",
  },
  lb: {
    copyright: "Copyright © {{year}}",
    "copyright-all": "All Rëchter vunereet",
    "copyright-name": "Gemeng Schëffleng",
    "powered-101": "Entwéckelt vun 101 Studios",
  },
}
