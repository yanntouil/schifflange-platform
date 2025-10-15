'use client'

/**
 * Kulturama
 */

import { Activities } from '@/cms/dialogs/activities'
import { Documents } from '@/cms/dialogs/documents'
import { Gallery } from '@/cms/dialogs/gallery'
import { Quote } from '@/cms/dialogs/quote'
import { Richtext } from '@/cms/dialogs/richtext'
import { extractCardsProps } from '@/cms/dialogs/utils'
import { asyncHelpers } from '@/cms/utils'
import { useTranslation } from '@/lib/localize'
import { useItem } from './use-item'
import { prose } from '@compo/ui/src/variants'

/**
 * Consultation
 */
export const Consultation = () => {
  const { _, language } = useTranslation(dictionary)
  const gallery = useItem<'medias-images'>('86dd4894-040d-4184-8a13-57bfdfe2d3c7', language)
  const documents = useItem<'medias-documents'>('5ca57807-fad9-49d1-a16e-63cc4418c136', language)
  return (
    <div>
      <Quote
        title={_('consultation.quote.title')}
        level={3}
        prose={prose({ variant: 'quote' })}
        content={_('consultation.quote.content')}
      />
      <Richtext
        title={_('consultation.richText.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('consultation.richText.content')}
      />
      {documents.isReady && (
        <Documents
          title={_('consultation.documents.title')}
          level={3}
          files={asyncHelpers.extractFiles(documents.item, documents.item.props.documents)}
        />
      )}
      {gallery.isReady && (
        <Gallery
          title={_('consultation.gallery.title')}
          level={3}
          files={asyncHelpers.extractFiles(gallery.item, gallery.item.props.images)}
        />
      )}
    </div>
  )
}

/**
 * Incubation
 */
export const Incubation = () => {
  const { language } = useTranslation(dictionary)
  const activities = useItem<'features-cards'>('3e075694-dd21-4162-82dd-64abe17e222f', language)
  return (
    <div>{activities.isReady && <Activities cards={extractCardsProps(activities.item)} />}</div>
  )
}

/**
 * Scaling
 */
export const Scaling = () => {
  return <div></div>
}

/**
 * translations
 */
const dictionary = {
  fr: {
    consultation: {
      quote: {
        title: 'Opportunités',
        content: `<ul>
        <li>
          L’implication d’artistes constitue un enrichissement professionnel pour le personnel des SEA-S. 
        </li>
        <li>L’implication d’artistes peut renforcer le dialogue entre le personnel des SEA-S et les enfants.</li>
      </ul>`,
      },
      richText: {
        title: 'Propositions',
        content: `<ul>
          <li>
            <h3>Meilleurs moments et concepts pour la réalisation de projets :</h3>
            <p>
              <b>À petite échelle</b> : les mardi et jeudi après-midi ; soit sous forme d'activités ponctuelles, projets
              de courte durée, ou bien pendant une plage hebdomadaire fixe durant quelques semaines.
            </p>
            <p>
              <b>À grande échelle</b> : durant les vacances scolaires ; soit durant plusieurs jours de suite, pendant une
              semaine thématique, ou bien lors d'une journée entière, p.ex. sous forme d'une « foire culturelle » où
              plusieurs artistes sont impliqués.
            </p>
          </li>
          <li>
            <h3>Augmentation de l'offre de formations continues pour le personnel SEA-S</h3>
            <p>Formations théoriques concernant l'éducation culturelle.</p>
            <p>
              Formations pratiques dans différents domaines culturels et artistiques : p.ex. les artistes forment le
              personnel SEA-S à animer des ateliers pédagogiques autour d’activités culturelles.
            </p>
          </li>
          <li>
            <h3>Facilitation de l'utilisation de la plateforme en ligne kulturama.lu</h3>
          </li>
          <li>
            <h3>
              Sensibilisation (personnel SEA-S,  parents, enfants) sur l'importance et la plus-value de l'éducation
              culturelle pour le développement de l'enfant.
            </h3>
          </li>
          <li>
            <h3>
              Session d’information sur Kulturama pour le secteur de l’éducation non formelle et session d’information sur
              l’éducation non formelle pour les artistes.
            </h3>
          </li>
        </ul>`,
      },
      documents: {
        title: 'Documents à télécharger',
      },
      gallery: {
        title: 'Galerie des ateliers pratiques menés par les artistes',
      },
    },
  },

  de: {
    consultation: {
      quote: {
        title: 'Chancen',
        content: `<ul>
        <li>
          Die Einbeziehung von Künstlern stellt eine berufliche Bereicherung für das Personal der SEA-S dar. 
        </li>
        <li>Die Einbeziehung von Künstlern kann den Dialog zwischen dem Personal der SEA-S und den Kindern stärken.</li>
      </ul>`,
      },
      richText: {
        title: 'Vorschläge',
        content: `<ul>
          <li>
            <h3>Beste Momente und Konzepte für die Realisierung von Projekten:</h3>
            <p>
              <b>Im kleinen Rahmen</b>: dienstags und donnerstags nachmittags; entweder in Form von punktuellen Aktivitäten, Projekten
              kurzer Dauer, oder während eines festen wöchentlichen Zeitfensters für einige Wochen.
            </p>
            <p>
              <b>Im großen Rahmen</b>: während der Schulferien; entweder über mehrere aufeinanderfolgende Tage, während einer
              thematischen Woche, oder während eines ganzen Tages, z.B. in Form einer „Kulturmesse", bei der
              mehrere Künstler beteiligt sind.
            </p>
          </li>
          <li>
            <h3>Erhöhung des Angebots an Weiterbildungen für das SEA-S-Personal</h3>
            <p>Theoretische Schulungen zur kulturellen Bildung.</p>
            <p>
              Praktische Schulungen in verschiedenen kulturellen und künstlerischen Bereichen: z.B. bilden Künstler das
              SEA-S-Personal in der Leitung von pädagogischen Workshops rund um kulturelle Aktivitäten aus.
            </p>
          </li>
          <li>
            <h3>Erleichterung der Nutzung der Online-Plattform kulturama.lu</h3>
          </li>
          <li>
            <h3>
              Sensibilisierung (SEA-S-Personal, Eltern, Kinder) für die Bedeutung und den Mehrwert der kulturellen
              Bildung für die Entwicklung des Kindes.
            </h3>
          </li>
          <li>
            <h3>
              Informationsveranstaltung über Kulturama für den Bereich der non-formalen Bildung und Informationsveranstaltung über
              non-formale Bildung für Künstler.
            </h3>
          </li>
        </ul>`,
      },
      documents: {
        title: 'Dokumente zum Download',
      },
      gallery: {
        title: 'Galerie der praktischen Workshops, die von den Künstlern durchgeführt wurden',
      },
    },
  },
  en: {
    consultation: {
      quote: {
        title: 'Opportunities',
        content: `<ul>
        <li>
          The involvement of artists constitutes a professional enrichment for SEA-S staff.
        </li>
        <li>The involvement of artists can strengthen the dialogue between SEA-S staff and children.</li>
      </ul>`,
      },
      richText: {
        title: 'Proposals',
        content: `<ul>
          <li>
            <h3>Best moments and concepts for project implementation:</h3>
            <p>
              <b>Small scale</b>: Tuesday and Thursday afternoons; either in the form of one-off activities, short-term projects,
              or during a fixed weekly slot for a few weeks.
            </p>
            <p>
              <b>Large scale</b>: during school holidays; either over several consecutive days, during a
              themed week, or during a full day, e.g. in the form of a "cultural fair" where
              several artists are involved.
            </p>
          </li>
          <li>
            <h3>Increase in continuing education offerings for SEA-S staff</h3>
            <p>Theoretical training on cultural education.</p>
            <p>
              Practical training in various cultural and artistic fields: e.g. artists train
              SEA-S staff to facilitate educational workshops around cultural activities.
            </p>
          </li>
          <li>
            <h3>Facilitating the use of the online platform kulturama.lu</h3>
          </li>
          <li>
            <h3>
              Awareness raising (SEA-S staff, parents, children) on the importance and added value of cultural
              education for child development.
            </h3>
          </li>
          <li>
            <h3>
              Information session on Kulturama for the non-formal education sector and information session on
              non-formal education for artists.
            </h3>
          </li>
        </ul>`,
      },
      documents: {
        title: 'Documents to download',
      },
      gallery: {
        title: 'Gallery of practical workshops conducted by the artists',
      },
    },
  },
}
