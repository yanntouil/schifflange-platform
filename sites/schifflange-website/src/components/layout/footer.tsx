import { Ui } from "@/components/ui"
import { LocalizeLanguage } from "@/lib/localize"
import { Api } from "@/service"
import { getServerTranslation } from "@/utils/localize"
import { SrOnly } from "@compo/ui/src/components"
import { A, cxm, D, T } from "@compo/utils"
import Image from "next/image"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
import { Container } from "./container"
import { FooterCityApp } from "./footer.city-app"
import { FooterCopyright } from "./footer.copyright"
import { FooterMenuItem } from "./footer.item"
import { FooterScrollTop } from "./footer.scroll-top"
import LogoImage from "./logo.png"
import { Wrapper } from "./wrapper"

/**
 * Footer configuration
 * Centralized configuration for all footer information
 */
const footerConfig = {
  address: {
    line1: "B.P. 11, Avenue de la Libération",
    line2: "L-3801 Schifflange",
  },
  contact: {
    phone: "(+352) 54 50 61-1",
    fax: "(+352) 54 42 02",
    email: "info@schifflange.lu",
  },
  openingHours: {
    morning: "08:00 - 12:00",
    afternoon: "14:00 - 17:00",
  },
  permanences: {
    workshop: {
      phone: "54 50 61 – 250",
    },
    civilRegistry: {
      phone: "621 458 757",
      day: "saturday",
      from: "10:00",
      to: "12:00",
    },
  },
  social: {
    facebook: "https://www.facebook.com/Gemeng-Schëffleng-391576758055723/",
    twitter: "https://twitter.com/hashtag/schifflange?lang=en",
    youtube: "https://www.youtube.com/@GemengScheffleng",
    instagram: "http://www.instagram.com/gemengscheffleng",
  },
}
type FooterConfig = typeof footerConfig

/**
 * footer
 * the footer of the page
 */
type FooterProps = {
  lang: LocalizeLanguage
  menu: Api.MenuItemWithRelations[]
}
export const Footer = (props: FooterProps) => {
  const { lang } = props
  const { _ } = getServerTranslation(lang, dictionary)
  SrOnly
  return (
    <footer>
      <Wrapper className='py-10'>
        <Container className='flex justify-between items-end'>
          <FooterCityApp lang={lang} />
          <FooterScrollTop lang={lang} />
        </Container>
      </Wrapper>
      <Wrapper className='border-t-[2px] border-secondary bg-white py-10 [&_a]:focus-visible:ring-offset-white'>
        <Container className='flex flex-col gap-5'>
          <div>
            <Ui.Link href='/' className={Ui.variants.link({ color: "secondary" })}>
              <Image src={LogoImage} alt={_("logo-alt")} className='h-9 w-auto' width={112} height={36} priority />
              <Ui.SrOnly>{_("homepage")}</Ui.SrOnly>
            </Ui.Link>
          </div>
          <div className='grid @5xl/wrapper:grid-cols-[auto_1fr] gap-x-16 gap-y-10 w-full'>
            <div className='flex flex-row flex-wrap gap-x-16 gap-y-4 pt-1'>
              <FooterContactInfo {...props} />
              <FooterOpeningHours {...props} />
              <FooterOfficeHours {...props} />
            </div>
            <FooterMenu {...props} />
          </div>
        </Container>
      </Wrapper>
      <FooterCopyright lang={lang} />
    </footer>
  )
}

/**
 * Display address, phone, fax and email
 */
const FooterContactInfo: React.FC<FooterProps> = ({ lang }) => {
  const { _ } = getServerTranslation(lang, dictionary)

  return (
    <div className=''>
      <ul className='flex flex-col gap-2 text-sm'>
        <li>
          <p className='font-bold pb-2 uppercase text-xs'>
            {footerConfig.address.line1}
            <br />
            {footerConfig.address.line2}
          </p>
        </li>

        <li>
          {_("phone")}:{" "}
          <a
            href={`tel:${cleanPhoneNumber(footerConfig.contact.phone)}`}
            className={Ui.variants.link({ color: "foreground" })}
          >
            {footerConfig.contact.phone}
          </a>
        </li>
        <li>
          {_("fax")}:{" "}
          <a
            href={`tel:${cleanPhoneNumber(footerConfig.contact.fax)}`}
            className={Ui.variants.link({ color: "foreground" })}
          >
            {footerConfig.contact.fax}
          </a>
        </li>
        <li>
          {_("email")}:{" "}
          <a href={`mailto:${footerConfig.contact.email}`} className={Ui.variants.link({ color: "secondary" })}>
            {footerConfig.contact.email}
          </a>
        </li>
      </ul>
    </div>
  )
}

/**
 * Display opening hours from and to and social links
 */
const FooterOpeningHours: React.FC<FooterProps> = ({ lang }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  return (
    <div className='flex flex-col gap-2'>
      <p className='font-bold uppercase text-xs'>{_("opening-hours")}:</p>
      <ul className='flex flex-col gap-2 text-sm'>
        <li>{footerConfig.openingHours.morning}</li>
        <li>{footerConfig.openingHours.afternoon}</li>
      </ul>
      <FooterSocials className='pt-2 md:flex hidden' />
    </div>
  )
}

/**
 * Display social links
 */
type FooterSocialsProps = React.ComponentProps<"ul">
const FooterSocials = ({ className, ...props }: FooterSocialsProps) => {
  const socialLinks = makeSocialLinks(footerConfig)
  return (
    <ul className={cxm("flex gap-2", className)} {...props}>
      {socialLinks.map(({ name, url, Icon }) => (
        <li key={name}>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer nofollow'
            title={name}
            className={cxm(Ui.variants.link({ color: "secondary", className: "p-1 rounded-full" }))}
          >
            <Icon className='size-6' aria-hidden='true' />
            <Ui.SrOnly>{name}</Ui.SrOnly>
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Display office hours for the workshop and civil registry
 */
const FooterOfficeHours: React.FC<FooterProps> = ({ lang }) => {
  const { _, format } = getServerTranslation(lang, dictionary)
  const weekDays = makeWeekDays(format)
  const { workshop, civilRegistry } = footerConfig.permanences
  return (
    <div className='flex flex-col gap-2 text-sm'>
      <p className='font-bold uppercase text-xs'>{_("office-hours")}:</p>
      <ul className='space-y-3'>
        <li>
          <p className='font-semibold'>{_("workshop-title")}</p>
          <p className='text-xs text-muted-foreground italic'>{_("workshop-emergency")}</p>
          <p className='pt-1'>
            {_("phone")}{" "}
            <a href={`tel:${cleanPhoneNumber(workshop.phone)}`} className={Ui.variants.link({ color: "foreground" })}>
              {workshop.phone}
            </a>
          </p>
        </li>
        <li>
          <p className='font-semibold'>{_("civil-registry-title")}</p>
          <p className='text-xs text-muted-foreground italic'>
            {_("civil-registry-info", {
              day: D.get(weekDays, civilRegistry.day) ?? "",
              from: civilRegistry.from,
              to: civilRegistry.to,
            })}
          </p>
          <p className='pt-1'>
            {_("phone")}{" "}
            <a
              href={`tel:${cleanPhoneNumber(civilRegistry.phone)}`}
              className={Ui.variants.link({ color: "foreground" })}
            >
              {civilRegistry.phone}
            </a>
          </p>
        </li>
      </ul>
    </div>
  )
}

/**
 * Display the footer menu
 */
const FooterMenu: React.FC<FooterProps> = ({ lang, menu }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  // Split menu in half, if odd number, first column gets the extra item
  const midpoint = Math.ceil(menu.length / 2)
  const firstColumn = A.slice(menu, 0, midpoint)
  const secondColumn = A.sliceToEnd(menu, midpoint)

  return (
    <div className='@container/footer-menu'>
      <nav className='grid @xl/footer-menu:grid-cols-2 gap-x-5' aria-label={_("footer-menu")}>
        <div className='flex flex-col items-start'>
          {A.map(firstColumn, (item) => (
            <FooterMenuItem key={item.id} item={item} />
          ))}
        </div>
        <div className='flex flex-col items-start'>
          {A.map(secondColumn, (item) => (
            <FooterMenuItem key={item.id} item={item} />
          ))}
        </div>
      </nav>
    </div>
  )
}

/**
 * Make social links with icons and alt text
 */
const makeSocialLinks = (config: FooterConfig) => [
  {
    name: "Facebook",
    url: config.social.facebook,
    Icon: FaFacebook,
  },
  {
    name: "Twitter",
    url: config.social.twitter,
    Icon: FaTwitter,
  },
  {
    name: "YouTube",
    url: config.social.youtube,
    Icon: FaYoutube,
  },
  {
    name: "Instagram",
    url: config.social.instagram,
    Icon: FaInstagram,
  },
]

/**
 * Make week days with the format provided to translate the day of the week
 */
const makeWeekDays = (format: (date: Date, pattern: string) => string) => {
  // Get a week starting from Monday
  const baseDate = new Date(2024, 0, 1) // Monday, January 1, 2024
  const startOfWeek = T.startOfWeek(baseDate, { weekStartsOn: 1 })
  const endOfWeek = T.endOfWeek(baseDate, { weekStartsOn: 1 })
  const daysOfWeek = T.eachDayOfInterval({ start: startOfWeek, end: endOfWeek })
  return A.reduce(daysOfWeek, {} as Record<string, string>, (acc, date) =>
    D.set(acc, date.getDay(), format(date, "EEEE"))
  )
}

/**
 * Clean the phone number to remove '(' ) ')','-' and spaces
 */
const cleanPhoneNumber = (phone: string) => phone.replace(/[()\s-]/g, "")

/**
 * translations
 */
const dictionary = {
  en: {
    "logo-alt": "Municipality of Schifflange",
    homepage: "Homepage of the Municipality of Schifflange",
    cookies: "Manage cookies",

    copyright: "Copyright © {{year}}",
    "copyright-all": "All rights reserved",
    "copyright-name": "Municipality of Schifflange",
    "powered-101": "Powered by 101 Studios",

    phone: "Tel: ",
    fax: "Fax: ",
    email: "Email: ",

    "opening-hours": "Opening hours",
    "office-hours": "Office hours",
    "workshop-title": "Municipal workshop",
    "workshop-emergency": "Emergency after 3:00 PM and on weekends",
    "civil-registry-title": "Civil registry",
    "civil-registry-info": "Only in case of death - {{day}} {{from}} - {{to}}",
    "footer-menu": "Footer menu",
  },
  fr: {
    "logo-alt": "Commune de Schifflange",
    homepage: "Page d'accueil de la Commune de Schifflange",
    cookies: "Gérer les cookies",
    "powered-101": "Réalisé par 101 Studios",
    phone: "Tél",
    fax: "Fax",
    email: "Email",
    openingHours: "Heures d'ouverture",
    permanences: "Permanences",
    workshopTitle: "Atelier communal",
    workshopEmergency: "Cas d'urgence après 15:00 et le weekend :",
    civilRegistryTitle: "État civil",
    civilRegistryInfo: "Uniquement en cas de décès",
    "day.saturday": "le samedi",
    "footer-menu": "Menu du bas de page",
  },
  de: {
    "logo-alt": "Gemeinde Schifflingen",
    homepage: "Startseite der Gemeinde Schifflingen",
    cookies: "Cookies verwalten",
    "powered-101": "Entwickelt von 101 Studios",
    phone: "Tel",
    fax: "Fax",
    email: "E-Mail",
    openingHours: "Öffnungszeiten",
    permanences: "Dienststunden",
    workshopTitle: "Gemeindewerkstatt",
    workshopEmergency: "Notfall nach 15:00 Uhr und am Wochenende:",
    civilRegistryTitle: "Standesamt",
    civilRegistryInfo: "Nur im Todesfall",
    "day.saturday": "Samstag",
    "footer-menu": "Footer Menu",
  },
  lb: {
    "logo-alt": "Gemeng Schëffleng",
    homepage: "Startsäit vun der Gemeng Schëffleng",
    cookies: "Cookies geréieren",
    powered: "Entwéckelt vun",
    "powered-101": "101 Studios",
    phone: "Tel",
    fax: "Fax",
    email: "E-Mail",
    openingHours: "Ouvertureszäiten",
    permanences: "Permanencen",
    workshopTitle: "Gemengenateliers",
    workshopEmergency: "Noutfall no 15:00 an um Weekend:",
    civilRegistryTitle: "Zivilstand",
    civilRegistryInfo: "Nëmmen am Fall vun engem Doudesfall",
    "day.saturday": "Samschdes",
    "footer-menu": "Footer Menu",
  },
}

/*
<div id="inner-footer">
        <div class="upper-footer group-it">
            <a class="logo-wrapper" title="Schifflange" id="logo-footer" href="https://schifflange.lu" rel="nofollow">
                <img class="logo" src="https://schifflange.lu/wp-content/themes/schifflange/images/logo.png" alt="Schifflange logo">
                <span class="sr-only">Commune de Schifflange</span>
            </a>
        </div>
        <div class="lower-footer">
            <div class="inner-footer-wrapper"><p class="footer-column-header has-address group-it mobile-social"> B.P. 11, Avenue de la Libération<br>
L-3801 Schifflange
 </p><div class="inline-block group-it"><p class="footer-column-header desktop-social"> B.P. 11, Avenue de la Libération<br>
L-3801 Schifflange
 </p><a href="tel:(+352) 54 50 61-1">Tél: (+352) 54 50 61-1 </a><p>Fax: (+352) 54 42 02 </p><p>Email:  <a class="email mail-link" href="javascript:;" data-enc-email="vasb[at]fpuvssynatr.yh " data-wpel-link="ignore"><span id="eeb-651320-445857">info@schifflange.lu  </span><script type="text/javascript">(function(){var ml="eglc.fioasn42u0h%",mi="6:57@;>93?65528:1042=@<>@<>",o="";for(var j=0,l=mi.length;j<l;j++){o+=ml.charAt(mi.charCodeAt(j)-48);}document.getElementById("eeb-651320-445857").innerHTML = decodeURIComponent(o);}());</script><noscript>*protected email*</noscript></a></p></div><div class="inline-block group-it  tablet-down"><p class="footer-column-header">  Heures d’ouverture: </p><p> 08:00 - 12:00 </p><p> 14:00 - 17:00  </p><div class="desktop-social social-wrapper"><a target="_blank" class="icon-facebook" href="https://www.facebook.com/Gemeng-Schëffleng-391576758055723/" title="Facebook"><span class="sr-only">facebook</span></a><a target="_blank" class="icon-twitter" href="https://twitter.com/hashtag/schifflange?lang=en" title="Twitter"><span class="sr-only">twitter</span></a><a target="_blank" class="icon-youtube" href="https://www.youtube.com/@GemengScheffleng" title="YouTube"><span class="sr-only">youtube</span></a><a target="_blank" class="icon-instagram" href="http://www.instagram.com/gemengscheffleng" title="Instagram"><span class="sr-only">instagram</span></a></div></div><div class="group-it"><p class="footer-column-header">  Permanences: </p><p> Atelier communal<br>
cas d’urgence après 15:00 et le weekend :<br>
Tél: 54 50 61 – 250<br>
<br>
Etat civil<br>
uniquement en cas de décès - le samedi 10:00 – 12:00 :<br>
Tél: 621 458 757  </p></div></div>
            <div class="navs-wrapper group-it">
                <div class="nav-element">
                    <ul id="menu-footer-left" class="nav footer-nav clearfix"><li id="menu-item-444" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-444"><a href="https://schifflange.lu/residents/population-and-etat-civil/">Population et état civil</a></li>
<li id="menu-item-446" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-446"><a href="https://schifflange.lu/residents/services-communaux/">Services communaux</a></li>
<li id="menu-item-13029" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-13029"><a rel="privacy-policy" href="https://schifflange.lu/mentions-legales/">Mentions légales</a></li>
<li id="menu-item-21453" class="js-cookie-settings-link menu-item menu-item-type-custom menu-item-object-custom menu-item-21453"><a href="#">Paramètres RGPD</a></li>
</ul>                </div>
                <div class="nav-element">
                    <ul id="menu-footer-left" class="nav footer-nav clearfix"><li id="menu-item-443" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-443"><a href="https://schifflange.lu/contact/">Contact</a></li>
<li id="menu-item-28655" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-28655"><a href="https://visite-virtuelle-360.ovh/schifflange2/">Visite virtuelle</a></li>
<li id="menu-item-8985" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8985"><a href="https://schifflange.lu/sitemap/">Sitemap</a></li>
</ul>                </div>
            </div>

            <div class="mobile-social group-it social-wrapper">

                <a target="_blank" class="icon-facebook" href="https://www.facebook.com/Gemeng-Schëffleng-391576758055723/" title="Facebook"></a><a target="_blank" class="icon-twitter" href="https://twitter.com/hashtag/schifflange?lang=en" title="Twitter"></a><a target="_blank" class="icon-youtube" href="https://www.youtube.com/@GemengScheffleng" title="YouTube"></a><a target="_blank" class="icon-instagram" href="http://www.instagram.com/gemengscheffleng" title="Instagram"></a>
            </div>


        </div>
    </div>
*/
