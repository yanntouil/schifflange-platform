'use client'

/**
 * Ludothèques
 */

import { Documents } from '@/cms/dialogs/documents'
import { Gallery } from '@/cms/dialogs/gallery'
import { Richtext } from '@/cms/dialogs/richtext'
import { asyncHelpers } from '@/cms/utils'
import { useTranslation } from '@/lib/localize'
import { useItem } from './use-item'
import { prose } from '@compo/ui/src/variants'

/**
 * Consultation
 */
export const Consultation = () => {
  const { _, language } = useTranslation(dictionary)
  const gallery = useItem<'medias-images'>('2f28e7ca-c4ee-41b4-bf6d-e1363c5d0c63', language)
  const documents = useItem<'medias-documents'>('f68392bb-2b2b-49ed-b4be-80694e16dd34', language)
  return (
    <div>
      <div>
        <p className='text-[20px] font-medium leading-normal text-powder-100'>
          {_('consultation.header.subtitle')}
        </p>
      </div>
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
          variant='consultation'
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
  const { _, language } = useTranslation(dictionary)
  const gallery = useItem<'medias-images'>('5572a84b-cd27-4758-9c8f-5d8d24df41e1', language)
  const documents = useItem<'medias-documents'>('248f15fe-436b-4d12-85ba-1b904b1082f6', language)
  return (
    <div>
      <div>
        <p className='text-[20px] font-medium leading-normal text-powder-100'>
          {_('incubation.header.subtitle')}
        </p>
      </div>
      <Richtext
        title={_('incubation.richText1.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('incubation.richText1.content')}
      />
      <Richtext
        title={_('incubation.richText2.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('incubation.richText2.content')}
      />
      <Richtext
        title={_('incubation.richText3.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('incubation.richText3.content')}
      />
      {documents.isReady && (
        <Documents
          title={_('incubation.documents.title')}
          variant='incubation'
          level={3}
          files={asyncHelpers.extractFiles(documents.item, documents.item.props.documents)}
        />
      )}
      {gallery.isReady && (
        <Gallery
          title={_('incubation.gallery.title')}
          level={3}
          files={asyncHelpers.extractFiles(gallery.item, gallery.item.props.images)}
        />
      )}
    </div>
  )
}

/**
 * Scaling
 */
export const Scaling = () => {
  const { _, language } = useTranslation(dictionary)
  const gallery = useItem<'medias-images'>('1682ba96-0d94-4666-8325-b67992da5964', language)
  const documents = useItem<'medias-documents'>('94b8b04c-3047-4853-abae-35ab7a1d4678', language)
  return (
    <div>
      <div>
        <p className='text-[20px] font-medium leading-normal text-powder-100'>
          {_('scaling.header.subtitle')}
        </p>
      </div>
      <Richtext
        title={_('scaling.richText1.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('scaling.richText1.content')}
      />
      <Richtext
        title={_('scaling.richText2.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('scaling.richText2.content')}
      />
      <Richtext
        title={_('scaling.richText3.title')}
        level={3}
        prose={prose({ variant: 'consultation' })}
        content={_('scaling.richText3.content')}
      />
      {documents.isReady && (
        <Documents
          title={_('scaling.documents.title')}
          level={3}
          files={asyncHelpers.extractFiles(documents.item, documents.item.props.documents)}
        />
      )}
      {gallery.isReady && (
        <Gallery
          title={_('scaling.gallery.title')}
          level={3}
          files={asyncHelpers.extractFiles(gallery.item, gallery.item.props.images)}
        />
      )}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    consultation: {
      header: {
        subtitle:
          'Après un appel à participation le 18 novembre 2024, 40 SEAS ont manifesté leur intérêt. Deux réunions de consultation (16.12.2024 et 09.01.2025), réunissant 24 structures, ont permis de clarifier plusieurs questions essentielles :',
      },
      richText: {
        title: 'Propositions',
        content: `<ul>
          <li>
            <p>
              Que représente une ludothèque pour chaque établissement ?
            </p>
          </li>
          <li>
            <p>Quels défis accompagnent sa mise en œuvre ?</p>
          </li>
          <li>
            <p>Quelles conditions sont nécessaires pour réussir sa mise en place pratique ?</p>
          </li>
        </ul>`,
      },
      documents: {
        title: 'Documents à télécharger',
      },
      gallery: {
        title: 'Galerie',
      },
    },
    incubation: {
      header: {
        subtitle:
          'Sept structures pilotes ont participé : Maison Relais Renert, Pinocchio, Foyer scolaire Belair Kayser,SEAS Bei de Kueben, Maison Relais Schoulkauz, SEA Woiwer et Maison Relais Mini Reewiermecher.',
        description: `
          <p>La mise en place du projet s’est structurée autour de quatre moments phares :</p>
          <ul>
          <li><b>12 février :</b> un atelier de co-construction a posé les bases du concept en définissant ensemble les lieux, le système d’emprunt et la répartition des responsabilités.</li>
          <li><b>26 février :</b> une formation continue a permis aux équipes de renforcer leurs compétencesautour de la culture du jeu et de s’approprier les jeux sélectionnés.</li>
          <li><b>23 mars et 11 juin :</b> deux rencontres d’échanges ont réuni les participants pour partager leurs expériences, identifier les réussites et élaborer collectivement des solutions aux défis rencontrés.</li>
          </ul>
        `,
      },
      richText1: {
        title: 'Bilan pratique :',
        content: `
          <p>La phase pilote du projet a livré des résultats concrets et encourageants :</p>
          <ul>
          <li><b>168 prêts de jeux</b> effectués en deux mois, avec une variation allant de 0 à 53 prêts selon les structures.</li>
          <li><b>Créneaux de jeu réguliers</b> instaurés, avec une forte fréquentation les lundis et vendredis.</li>
          <li><b>Implication active des enfants</b>, qui ont participé à la gestion des emprunts, à l’explication des règles et au contrôle du matériel.</li>
          <li><b>Flexibilité organisationnelle</b>, par exemple le déplacement des activités à l’extérieur en cas de beau temps.</li>
          <li><b>Seulement 7 % de jeux abîmés</b> au retour, confirmant le respect et le soin apportés par les familles.</li>
          </ul>
          <p>Ces résultats témoignent de l’efficacité du projet et de son appropriation rapide par les structures comme par les enfants.</p>
        `,
      },
      richText2: {
        title: 'Bilan qualitatif :',
        content: `
          <p>Le projet a été accompagné par une évaluation scientifique rigoureuse, articulée autour de trois volets complémentaires :</p>
          <ul>
          <li>La réalisation de pré- et post-tests auprès du personnel éducatif,</li>
          <li>Des enquêtes menées auprès des parents,</li>
          <li>Ainsi qu’une documentation continue des activités dans les structures participantes.</li>
          </ul>
        `,
      },
      richText3: {
        title: 'Bilan qualitatif :',
        content: `
          <ul>
          <li>100 % des professionnels reconnaissent désormais les jeux de société comme une véritable méthode pédagogique,</li>
          <li>Extension du nombre de structures proposant des créneaux réguliers de jeu : de 1 à 6,</li>
          <li>Un temps hebdomadaire de jeu parfois supérieur à 9 heures,</li>
          <li>70 % des familles déclarent jouer ensemble seulement 0 à 3 heures par semaine,</li>
          <li>Les adultes restent les partenaires de jeu principaux des enfants.</li>
          </ul>
        `,
      },
      documents: {
        title: 'Documents à télécharger',
      },
      gallery: {
        title: 'Galerie',
      },
    },
    scaling: {
      header: {
        subtitle:
          'Toutes les conclusions du projet ont été réunies dans un guide pratique au format questions-réponses, qui aborde notamment :',
        description: `
          <ul>
          <li>L’aménagement et le choix de l’emplacement</li>
          <li>La sélection des jeux et la gestion du matériel</li>
          <li>Le système d’emprunt et son organisation</li>
          <li>La promotion de la culture du jeu</li>
          <li>Les ressources humaines et la participation des enfants</li>
          <li>Le budget (env. 1 200 € d’investissement initial)</li>
          </ul>
        `,
      },
      richText1: {
        title: 'Facteurs de succès',
        content: `
          <ul>
          <li>Enthousiasme du personnel éducatif</li>
          <li>Implication active des enfants dans tous les processus</li>
          <li>Démarrage modeste (3 jeux par tranche d’âge)</li>
          <li>Structures et règles claires</li>
          <li>Souplesse dans la mise en œuvre</li>
          </ul>
        `,
      },
      richText2: {
        title: 'Principaux défis',
        content: `
          <ul>
            <li>Gestion du temps (au moins 4 h/semaine nécessaires)</li>
            <li>Communication et engagement des parents</li>
            <li>Limitations d’espace</li>
            <li>Gestion et contrôle du matériel</li>
          </ul>
        `,
      },
      richText3: {
        title: 'Principaux défis',
        content: `
          <p>Le projet Ludothèques a atteint ses objectifs : la culture du jeu a été durablement renforcée, les enfants ont assumé des responsabilités, et les premiers effets positifs sur les relations familiales sont visibles.</p>
          <p>Le guide élaboré permet désormais à d’autres SEAS de créer leur propre ludothèque. La clé du succès réside dans la combinaison entre planification structurée, mise en œuvre flexible etenthousiasme des acteurs – en particulier des enfants, véritables ambassadeurs de la culture du jeu.</p>
        `,
      },
    },
  },

  de: {
    consultation: {
      header: {
        subtitle:
          'Nach einem Aufruf zur Teilnahme am 18. November 2024 bekundeten 40 SEA-S ihr Interesse. Zwei Beratungstreffen (16.12.2024 und 09.01.2025) mit 24 Strukturen ermöglichten es, mehrere wesentliche Fragen zu klären:',
      },
      richText: {
        title: 'Vorschläge',
        content: `<ul>
          <li>
            <p>
              Was bedeutet eine Ludothek für jede Einrichtung?
            </p>
          </li>
          <li>
            <p>Welche Herausforderungen begleiten ihre Umsetzung?</p>
          </li>
          <li>
            <p>Welche Bedingungen sind für eine erfolgreiche praktische Umsetzung erforderlich?</p>
          </li>
        </ul>`,
      },
      documents: {
        title: 'Dokumente zum Download',
      },
      gallery: {
        title: 'Galerie',
      },
    },
    incubation: {
      header: {
        subtitle:
          'Sieben Pilotstrukturen nahmen teil: Maison Relais Renert, Pinocchio, Foyer scolaire Belair Kayser, SEA-S Bei de Kueben, Maison Relais Schoulkauz, SEA Woiwer und Maison Relais Mini Reewiermecher.',
        description: `
          <p>Die Umsetzung des Projekts wurde um vier Höhepunkte strukturiert:</p>
          <ul>
          <li><b>12. Februar:</b> Ein Co-Konstruktions-Workshop legte die Grundlagen des Konzepts fest, indem gemeinsam die Orte, das Ausleihsystem und die Aufgabenverteilung definiert wurden.</li>
          <li><b>26. Februar:</b> Eine Weiterbildung ermöglichte es den Teams, ihre Kompetenzen rund um die Spielkultur zu stärken und sich die ausgewählten Spiele anzueignen.</li>
          <li><b>23. März und 11. Juni:</b> Zwei Austauschrunden brachten die Teilnehmer zusammen, um ihre Erfahrungen zu teilen, Erfolge zu identifizieren und gemeinsam Lösungen für angetroffene Herausforderungen zu erarbeiten.</li>
          </ul>
        `,
      },
      richText1: {
        title: 'Praktische Bilanz:',
        content: `
          <p>Die Pilotphase des Projekts lieferte konkrete und ermutigende Ergebnisse:</p>
          <ul>
          <li><b>168 Spielausleihen</b> in zwei Monaten durchgeführt, mit einer Variation von 0 bis 53 Ausleihen je nach Struktur.</li>
          <li><b>Regelmäßige Spielzeiten</b> eingeführt, mit starker Frequentierung montags und freitags.</li>
          <li><b>Aktive Beteiligung der Kinder</b>, die bei der Verwaltung der Ausleihen, der Regelerklärung und der Materialkontrolle mithalfen.</li>
          <li><b>Organisatorische Flexibilität</b>, zum Beispiel die Verlegung der Aktivitäten nach draußen bei schönem Wetter.</li>
          <li><b>Nur 7 % beschädigte Spiele</b> bei der Rückgabe, was die Achtung und Sorgfalt der Familien bestätigt.</li>
          </ul>
          <p>Diese Ergebnisse bezeugen die Wirksamkeit des Projekts und seine schnelle Aneignung durch die Strukturen wie auch durch die Kinder.</p>
        `,
      },
      richText2: {
        title: 'Qualitative Bilanz:',
        content: `
          <p>Das Projekt wurde von einer rigorosen wissenschaftlichen Evaluation begleitet, die sich um drei komplementäre Bereiche gliederte:</p>
          <ul>
          <li>Die Durchführung von Vor- und Nachtests beim pädagogischen Personal,</li>
          <li>Umfragen bei den Eltern,</li>
          <li>Sowie eine kontinuierliche Dokumentation der Aktivitäten in den teilnehmenden Strukturen.</li>
          </ul>
        `,
      },
      richText3: {
        title: 'Qualitative Bilanz:',
        content: `
          <ul>
          <li>100 % der Fachkräfte erkennen Gesellschaftsspiele nun als echte pädagogische Methode an,</li>
          <li>Erweiterung der Anzahl der Strukturen, die regelmäßige Spielzeiten anbieten: von 1 auf 6,</li>
          <li>Eine wöchentliche Spielzeit von manchmal über 9 Stunden,</li>
          <li>70 % der Familien geben an, nur 0 bis 3 Stunden pro Woche zusammen zu spielen,</li>
          <li>Die Erwachsenen bleiben die Hauptspielpartner der Kinder.</li>
          </ul>
        `,
      },
      documents: {
        title: 'Dokumente zum Download',
      },
      gallery: {
        title: 'Galerie',
      },
    },
    scaling: {
      header: {
        subtitle:
          'Alle Schlussfolgerungen des Projekts wurden in einem praktischen Leitfaden im Frage-Antwort-Format zusammengefasst, der insbesondere behandelt:',
        description: `
          <ul>
          <li>Die Einrichtung und Standortwahl</li>
          <li>Die Spielauswahl und Materialverwaltung</li>
          <li>Das Ausleihsystem und seine Organisation</li>
          <li>Die Förderung der Spielkultur</li>
          <li>Die Personalressourcen und Kinderbeteiligung</li>
          <li>Das Budget (ca. 1.200 € Anfangsinvestition)</li>
          </ul>
        `,
      },
      richText1: {
        title: 'Erfolgsfaktoren',
        content: `
          <ul>
          <li>Begeisterung des pädagogischen Personals</li>
          <li>Aktive Beteiligung der Kinder in allen Prozessen</li>
          <li>Bescheidener Start (3 Spiele pro Altersgruppe)</li>
          <li>Klare Strukturen und Regeln</li>
          <li>Flexibilität in der Umsetzung</li>
          </ul>
        `,
      },
      richText2: {
        title: 'Hauptherausforderungen',
        content: `
          <ul>
            <li>Zeitmanagement (mindestens 4 Std./Woche erforderlich)</li>
            <li>Kommunikation und Engagement der Eltern</li>
            <li>Platzbeschränkungen</li>
            <li>Verwaltung und Kontrolle des Materials</li>
          </ul>
        `,
      },
      richText3: {
        title: 'Hauptherausforderungen',
        content: `
          <p>Das Ludothek-Projekt hat seine Ziele erreicht: Die Spielkultur wurde nachhaltig gestärkt, die Kinder haben Verantwortung übernommen, und die ersten positiven Auswirkungen auf die Familienbeziehungen sind sichtbar.</p>
          <p>Der erstellte Leitfaden ermöglicht es nun anderen SEA-S, ihre eigene Ludothek zu schaffen. Der Schlüssel zum Erfolg liegt in der Kombination aus strukturierter Planung, flexibler Umsetzung und Begeisterung der Akteure – insbesondere der Kinder, wahre Botschafter der Spielkultur.</p>
        `,
      },
    },
  },
  en: {
    consultation: {
      header: {
        subtitle:
          'After a call for participation on November 18, 2024, 40 SEA-S expressed interest. Two consultation meetings (16.12.2024 and 09.01.2025), bringing together 24 structures, helped clarify several essential questions:',
      },
      richText: {
        title: 'Proposals',
        content: `<ul>
          <li>
            <p>
              What does a toy library represent for each institution?
            </p>
          </li>
          <li>
            <p>What challenges accompany its implementation?</p>
          </li>
          <li>
            <p>What conditions are necessary for successful practical implementation?</p>
          </li>
        </ul>`,
      },
      documents: {
        title: 'Documents to download',
      },
      gallery: {
        title: 'Gallery',
      },
    },
    incubation: {
      header: {
        subtitle:
          'Seven pilot structures participated: Maison Relais Renert, Pinocchio, Foyer scolaire Belair Kayser, SEA-S Bei de Kueben, Maison Relais Schoulkauz, SEA Woiwer and Maison Relais Mini Reewiermecher.',
        description: `
          <p>The project implementation was structured around four key moments:</p>
          <ul>
          <li><b>February 12:</b> A co-construction workshop laid the foundation of the concept by jointly defining locations, the lending system, and responsibility distribution.</li>
          <li><b>February 26:</b> Continuing education enabled teams to strengthen their skills around game culture and master the selected games.</li>
          <li><b>March 23 and June 11:</b> Two exchange meetings brought participants together to share experiences, identify successes, and collectively develop solutions to encountered challenges.</li>
          </ul>
        `,
      },
      richText1: {
        title: 'Practical Assessment:',
        content: `
          <p>The pilot phase of the project delivered concrete and encouraging results:</p>
          <ul>
          <li><b>168 game loans</b> made in two months, with variation ranging from 0 to 53 loans depending on the structure.</li>
          <li><b>Regular game sessions</b> established, with strong attendance on Mondays and Fridays.</li>
          <li><b>Active involvement of children</b>, who participated in loan management, rule explanation, and material control.</li>
          <li><b>Organizational flexibility</b>, for example moving activities outdoors in good weather.</li>
          <li><b>Only 7% of games damaged</b> upon return, confirming the respect and care shown by families.</li>
          </ul>
          <p>These results testify to the project's effectiveness and its rapid adoption by structures as well as children.</p>
        `,
      },
      richText2: {
        title: 'Qualitative Assessment:',
        content: `
          <p>The project was accompanied by a rigorous scientific evaluation, structured around three complementary components:</p>
          <ul>
          <li>Conducting pre- and post-tests with educational staff,</li>
          <li>Surveys conducted with parents,</li>
          <li>As well as continuous documentation of activities in participating structures.</li>
          </ul>
        `,
      },
      richText3: {
        title: 'Qualitative Assessment:',
        content: `
          <ul>
          <li>100% of professionals now recognize board games as a genuine pedagogical method,</li>
          <li>Extension of the number of structures offering regular game sessions: from 1 to 6,</li>
          <li>Weekly game time sometimes exceeding 9 hours,</li>
          <li>70% of families report playing together only 0 to 3 hours per week,</li>
          <li>Adults remain children's primary game partners.</li>
          </ul>
        `,
      },
      documents: {
        title: 'Documents to download',
      },
      gallery: {
        title: 'Gallery',
      },
    },
    scaling: {
      header: {
        subtitle:
          'All project conclusions have been compiled into a practical Q&A format guide, which notably addresses:',
        description: `
          <ul>
          <li>Setup and location choice</li>
          <li>Game selection and material management</li>
          <li>Lending system and its organization</li>
          <li>Promoting game culture</li>
          <li>Human resources and children's participation</li>
          <li>Budget (approx. €1,200 initial investment)</li>
          </ul>
        `,
      },
      richText1: {
        title: 'Success Factors',
        content: `
          <ul>
          <li>Enthusiasm of educational staff</li>
          <li>Active involvement of children in all processes</li>
          <li>Modest start (3 games per age group)</li>
          <li>Clear structures and rules</li>
          <li>Flexibility in implementation</li>
          </ul>
        `,
      },
      richText2: {
        title: 'Main Challenges',
        content: `
          <ul>
            <li>Time management (at least 4 hours/week required)</li>
            <li>Communication and parent engagement</li>
            <li>Space limitations</li>
            <li>Material management and control</li>
          </ul>
        `,
      },
      richText3: {
        title: 'Main Challenges',
        content: `
          <p>The Toy Library project achieved its objectives: game culture has been sustainably strengthened, children have assumed responsibilities, and the first positive effects on family relationships are visible.</p>
          <p>The developed guide now enables other SEA-S to create their own toy library. The key to success lies in the combination of structured planning, flexible implementation, and enthusiasm of the actors – particularly children, true ambassadors of game culture.</p>
        `,
      },
    },
  },
}
