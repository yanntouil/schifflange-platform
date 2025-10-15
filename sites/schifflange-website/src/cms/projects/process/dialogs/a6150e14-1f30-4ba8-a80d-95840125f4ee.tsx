'use client'

/**
 * Ludothèques
 */

import { Richtext } from '@/cms/dialogs/richtext'
import { Videos } from '@/cms/dialogs/videos'
import { Dialog } from '@/components/dialog'
import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { useTranslation } from '@/lib/localize'
import Image, { StaticImageData } from 'next/image'
import Card1Image from './images/3aa2e1835768a4b8a82c78417706fe5ff3058fec.png'
import CrecheBoumba3 from './images/4bf2c0a4711f43cbf73622b0f8686acd5a924eea.jpg'
import CrechePommeDapi from './images/559b12600a399095ed61281b1f4420e8defbb478.jpg'
import Card3Image from './images/69af4b7ab094439ff0fb031ad3f3608521fd0f39.png'
import Card2Image from './images/6d165b1ab1ab6a2b8aba3bff5f2c7d97ac6a0b2b.png'
import CrècheSimSalaBim from './images/88d875f60a62285686fa51fb035f67c95de8a3aa.png'
import CrècheKiddiesRosport from './images/9952eb9303fe3fdb5c85f5c789b798720ec29c5c.png'
import CrècheDappeshaus from './images/a49a0cfadd0c7cdc76deb66086f9bc5c198869c1.png'
import Kannervilla from './images/Logo-Kannervilla-Gepeppelte-Memmel.png'
import SEAIKokopelli from './images/seai-kokopelli.png'
import { prose } from '@compo/ui/src/variants'

/**
 * Consultation
 */
export const Consultation = () => {
  return null
}

/**
 * Incubation
 */
export const Incubation = () => {
  const { _, language } = useTranslation(dictionary)
  return (
    <div>
      <div>
        <p className='text-[20px] font-medium leading-normal text-powder-100'>
          {_('incubation.header.subtitle')}
        </p>
      </div>
      <div className='grid grid-cols-3 gap-x-[40px] gap-y-[24px]'>
        <ParticipatingStructure name='Crèche Pomme d’api' image={CrechePommeDapi} />
        <ParticipatingStructure name='Kannervilla Gepëppelte Mëmmel' image={Kannervilla} />
        <ParticipatingStructure name='Crèche Boumba 3' image={CrecheBoumba3} />
        <ParticipatingStructure name='SEAI Kokopelli' image={SEAIKokopelli} />
        <ParticipatingStructure name='Crèche Sim Sala Bim' image={CrècheSimSalaBim} />
        <ParticipatingStructure name='Crèche kiddies Rosport' image={CrècheKiddiesRosport} />
        <ParticipatingStructure name='SEAJ Fischbach Am Kuebenascht' image={CrècheKiddiesRosport} />
        <ParticipatingStructure name='Crèche Dappeshaus' image={CrècheDappeshaus} />
      </div>
      <Hn level={3} className='text-tuna-100 text-[24px] font-semibold leading-normal mb-3'>
        Lorem ipsum
      </Hn>
      <div className='grid grid-cols-3 gap-x-[40px] gap-y-[24px]'>
        <Card1 />
        <Card2 />
        <Card3 />
      </div>
    </div>
  )
}
const ParticipatingStructure = ({ name, image }: { name: string; image: StaticImageData }) => {
  return (
    <article className='rounded-[16px] bg-white p-[16px] space-y-[24px]'>
      <div className='h-[70px]'>
        <Image src={image} alt={name} className='max-w-[70px] max-h-[70px]' />
      </div>
      <Hn level={3} className='text-tuna-100 text-[14px] font-medium leading-normal'>
        {name}
      </Hn>
    </article>
  )
}

const buttonCx =
  'px-4 py-2 inline-flex items-center justify-center gap-2 rounded-[8px] text-[12px] leading-normal font-medium text-[#1D1D1B] border-[1.5px] border-[#E5D2B9] cursor-pointer'
const Card1 = () => {
  const { _, language } = useTranslation(dictionary)
  const title = _('incubation.card1.title')
  const description = _('incubation.card1.content')
  return (
    <article className='group'>
      {/* Image container */}
      <div className='relative'>
        <Image
          src={Card1Image}
          alt={title}
          className='aspect-[304/178] w-full object-cover rounded-[16px]'
        />
      </div>
      <div className='mt-4 space-y-2'>
        <Hn level={4} className={textVariants({ variant: 'cardTitleSmall' })}>
          {title}
        </Hn>
        <div
          className={prose({ variant: 'card' })}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div>
          <Dialog
            trigger={
              <button type='button' className={buttonCx}>
                {_('incubation.card1.trigger')}
                <ArrowSvg aria-hidden className='size-5' />
              </button>
            }
            title={_('incubation.card1.dialog.title')}
            description={_('incubation.card1.dialog.description')}
            className='max-w-[832px] overflow-hidden'
          >
            <Richtext
              title={_('incubation.card1.dialog.richText.title')}
              level={3}
              prose={prose({ variant: 'incubation' })}
              content={_('incubation.card1.dialog.richText.content')}
            />
            <Videos
              title={_('incubation.card1.dialog.videos1.title')}
              level={3}
              videos={[
                {
                  title: _('incubation.card1.dialog.videos1.video1.title'),
                  description: _('incubation.card1.dialog.videos1.video1.description'),
                  video: (
                    <Image
                      src={Card1Image}
                      alt={title}
                      className='aspect-[304/178] w-full object-cover rounded-[16px]'
                    />
                  ),
                },
                {
                  title: _('incubation.card1.dialog.videos1.video2.title'),
                  description: _('incubation.card1.dialog.videos1.video2.description'),
                  video: (
                    <Image
                      src={Card2Image}
                      alt={title}
                      className='aspect-[304/178] w-full object-cover rounded-[16px]'
                    />
                  ),
                },
                {
                  title: _('incubation.card1.dialog.videos1.video3.title'),
                  description: _('incubation.card1.dialog.videos1.video3.description'),
                  video: (
                    <Image
                      src={Card3Image}
                      alt={title}
                      className='aspect-[304/178] w-full object-cover rounded-[16px]'
                    />
                  ),
                },
              ]}
            />
            <Videos
              title={_('incubation.card1.dialog.videos2.title')}
              level={3}
              videos={[
                {
                  title: _('incubation.card1.dialog.videos2.video1.title'),
                  description: _('incubation.card1.dialog.videos2.video1.description'),
                  video: (
                    <Image
                      src={Card1Image}
                      alt={title}
                      className='aspect-[304/178] w-full object-cover rounded-[16px]'
                    />
                  ),
                },
                {
                  title: _('incubation.card1.dialog.videos2.video2.title'),
                  description: _('incubation.card1.dialog.videos2.video2.description'),
                  video: (
                    <Image
                      src={Card2Image}
                      alt={title}
                      className='aspect-[304/178] w-full object-cover rounded-[16px]'
                    />
                  ),
                },
                {
                  title: _('incubation.card1.dialog.videos2.video3.title'),
                  description: _('incubation.card1.dialog.videos2.video3.description'),
                  video: (
                    <Image
                      src={Card3Image}
                      alt={title}
                      className='aspect-[304/178] w-full object-cover rounded-[16px]'
                    />
                  ),
                },
              ]}
            />
          </Dialog>
        </div>
      </div>
    </article>
  )
}
const Card2 = () => {
  const { _, language } = useTranslation(dictionary)
  const title = _('incubation.card2.title')
  const description = _('incubation.card2.content')
  return (
    <article className='group'>
      <div className='relative'>
        <Image
          src={Card2Image}
          alt={title}
          className='aspect-[304/178] w-full object-cover rounded-[16px]'
        />
      </div>
      <div className='mt-4 space-y-2'>
        <Hn level={4} className={textVariants({ variant: 'cardTitleSmall' })}>
          {title}
        </Hn>
        <div
          className={prose({ variant: 'card' })}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div>
          <button type='button' className={buttonCx}>
            {_('incubation.card2.trigger')}
            <ArrowSvg aria-hidden className='size-5' />
          </button>
        </div>
      </div>
    </article>
  )
}
const Card3 = () => {
  const { _, language } = useTranslation(dictionary)
  const title = _('incubation.card3.title')
  const description = _('incubation.card3.content')
  return (
    <article className='group'>
      <div className='relative'>
        <Image
          src={Card3Image}
          alt={title}
          className='aspect-[304/178] w-full object-cover rounded-[16px]'
        />
      </div>
      <div className='mt-2 space-y-2'>
        <Hn level={4} className={textVariants({ variant: 'cardTitleSmall' })}>
          {title}
        </Hn>
        <div
          className={prose({ variant: 'card' })}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div>
          <button type='button' className={buttonCx}>
            {_('incubation.card3.trigger')}
            <ArrowSvg aria-hidden className='size-5' />
          </button>
        </div>
      </div>
    </article>
  )
}

/**
 * Scaling
 */
export const Scaling = () => {
  return <div></div>
}

/**
 * icons
 */
const ArrowSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M4.6665 4.66663H11.3332M11.3332 4.66663V11.3333M11.3332 4.66663L4.6665 11.3333'
        stroke='#1D1D1B'
        strokeWidth='1.25'
        strokeLinecap='square'
        strokeLinejoin='round'
      />
    </svg>
  )
}
/**
 * translations
 */
const dictionary = {
  fr: {
    incubation: {
      header: {
        subtitle: 'Les structures participantes sont :',
      },
      card1: {
        title: 'Groupe de travail et d’échange',
        content: `
          <p>Ce projet invite les professionnels à explorer ensemble de nouvelles méthodes pour sensibiliser les enfants à leurs droits, en combinant outils pédagogiques, narration créative et retours d’expérience collectifs.</p>
        `,
        trigger: 'Consulter',
        dialog: {
          title: 'Groupe de travail et d’échange',
          richText: {
            title: 'Réunions d’information du 8 janvier 2025',
            content: `
            <ul>
            <li>
            Présentation détaillée du projet : Les participants ont découvert les objectifs, la vision et l’approche ludique du projet.
            </li>
            <li>
            Présentation des méthodes et instruments d’analyse : Des outils scientifiques, notamment une grille d’observation, ont été introduits pour accompagner le personnel éducatif tout au long du processus. Cette grille sera utilisée pour recueillir des données sur l’impact du jeu et les réactions des enfants, afin de perfectionner l’outil.
            </li>
            <li>
            Distribution du matériel pédagogique : Les participants ont reçu les marionnettes et les supports nécessaires pour démarrer le projet dans leurs crèches.
            </li>
            </ul>
            <p>
            Cet événement a également été un espace d’échange constructif, mettant en avant l’importance du rôle du personnel éducatif. Leurs observations, critiques constructives et retours d’expérience sont essentiels pour optimiser ce jeu et en faire un outil réellement adapté aux besoins des tout-petits.
            </p>
            <p>
            Grâce à la mobilisation et à l’expertise du personnel éducatif, cette initiative promet d’avoir un impact durable sur l’apprentissage des droits des enfants dès leur plus jeune âge.  
            </p>
            `,
          },
          videos1: {
            title: 'Groupe d’échange du 29 janvier 2025',
            video1: {
              title: 'Titre de la vidéo',
              description: 'Description de la vidéo',
            },
            video2: {
              title: 'Titre de la vidéo',
              description: 'Description de la vidéo',
            },
            video3: {
              title: 'Titre de la vidéo',
              description: 'Description de la vidéo',
            },
          },
          videos2: {
            title: 'Groupe d’échange du 12 mars 2025',
            video1: {
              title: 'Titre de la vidéo',
              description: 'Description de la vidéo',
            },
            video2: {
              title: 'Titre de la vidéo',
              description: 'Description de la vidéo',
            },
            video3: {
              title: 'Titre de la vidéo',
              description: 'Description de la vidéo',
            },
          },
        },
      },
      card2: {
        title: 'Formation continue',
        content: `
        <p>Ce projet invite les professionnels à explorer ensemble de nouvelles méthodes pour sensibiliser les enfants à leurs droits, en combinant outils pédagogiques, narration créative et retours d’expérience collectifs.</p>
        `,
        trigger: 'Consulter',
      },
      card3: {
        title: 'Suivi et analyse scientifique',
        content: `
        <p>À travers questionnaires, grilles d’observation et analyse rigoureuse des données, une évaluation de l’évolution de la perception des professionnels ainsi que les effets concrets sur les enfants a été possible.</p>
        `,
        trigger: 'Consulter',
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
    incubation: {
      header: {
        subtitle: 'Die teilnehmenden Strukturen sind:',
      },
      card1: {
        title: 'Arbeits- und Austauschgruppe',
        content: `
          <p>Dieses Projekt lädt Fachkräfte ein, gemeinsam neue Methoden zur Sensibilisierung von Kindern für ihre Rechte zu erkunden, indem pädagogische Werkzeuge, kreatives Erzählen und kollektive Erfahrungsaustausche kombiniert werden.</p>
        `,
        trigger: 'Einsehen',
        dialog: {
          title: 'Arbeits- und Austauschgruppe',
          richText: {
            title: 'Informationsveranstaltungen vom 8. Januar 2025',
            content: `
            <ul>
            <li>
            Detaillierte Projektvorstellung: Die Teilnehmer entdeckten die Ziele, die Vision und den spielerischen Ansatz des Projekts.
            </li>
            <li>
            Präsentation der Methoden und Analyseinstrumente: Wissenschaftliche Werkzeuge, insbesondere ein Beobachtungsraster, wurden eingeführt, um das pädagogische Personal während des gesamten Prozesses zu begleiten. Dieses Raster wird verwendet, um Daten über die Auswirkungen des Spiels und die Reaktionen der Kinder zu sammeln, um das Werkzeug zu perfektionieren.
            </li>
            <li>
            Verteilung der pädagogischen Materialien: Die Teilnehmer erhielten die Puppen und unterstützenden Materialien, die notwendig sind, um das Projekt in ihren Krippen zu starten.
            </li>
            </ul>
            <p>
            Diese Veranstaltung war auch ein Raum für konstruktiven Austausch und hob die Bedeutung der Rolle des pädagogischen Personals hervor. Ihre Beobachtungen, konstruktive Kritik und Erfahrungsrückblicke sind wesentlich, um dieses Spiel zu optimieren und es zu einem wirklich an die Bedürfnisse der Kleinkinder angepassten Werkzeug zu machen.
            </p>
            <p>
            Dank der Mobilisierung und Expertise des pädagogischen Personals verspricht diese Initiative, einen nachhaltigen Einfluss auf das Lernen der Kinderrechte von frühester Kindheit an zu haben.
            </p>
            `,
          },
          videos1: {
            title: 'Austauschgruppe vom 29. Januar 2025',
            video1: {
              title: 'Video-Titel',
              description: 'Video-Beschreibung',
            },
            video2: {
              title: 'Video-Titel',
              description: 'Video-Beschreibung',
            },
            video3: {
              title: 'Video-Titel',
              description: 'Video-Beschreibung',
            },
          },
          videos2: {
            title: 'Austauschgruppe vom 12. März 2025',
            video1: {
              title: 'Video-Titel',
              description: 'Video-Beschreibung',
            },
            video2: {
              title: 'Video-Titel',
              description: 'Video-Beschreibung',
            },
            video3: {
              title: 'Video-Titel',
              description: 'Video-Beschreibung',
            },
          },
        },
      },
      card2: {
        title: 'Weiterbildung',
        content: `
        <p>Dieses Projekt lädt Fachkräfte ein, gemeinsam neue Methoden zur Sensibilisierung von Kindern für ihre Rechte zu erkunden, indem pädagogische Werkzeuge, kreatives Erzählen und kollektive Erfahrungsaustausche kombiniert werden.</p>
        `,
        trigger: 'Einsehen',
      },
      card3: {
        title: 'Begleitung und wissenschaftliche Analyse',
        content: `
        <p>Durch Fragebögen, Beobachtungsraster und rigorose Datenanalyse war eine Bewertung der Entwicklung der Wahrnehmung der Fachkräfte sowie der konkreten Auswirkungen auf die Kinder möglich.</p>
        `,
        trigger: 'Einsehen',
      },
    },
  },
  en: {
    incubation: {
      header: {
        subtitle: 'The participating structures are:',
      },
      card1: {
        title: 'Working and Exchange Group',
        content: `
          <p>This project invites professionals to explore together new methods for raising children's awareness of their rights, combining educational tools, creative storytelling, and collective experience sharing.</p>
        `,
        trigger: 'View',
        dialog: {
          title: 'Working and Exchange Group',
          richText: {
            title: 'Information meetings of January 8, 2025',
            content: `
            <ul>
            <li>
            Detailed project presentation: Participants discovered the objectives, vision, and playful approach of the project.
            </li>
            <li>
            Presentation of methods and analysis instruments: Scientific tools, particularly an observation grid, were introduced to accompany educational staff throughout the process. This grid will be used to collect data on the impact of play and children's reactions, in order to perfect the tool.
            </li>
            <li>
            Distribution of educational material: Participants received the puppets and supporting materials necessary to start the project in their nurseries.
            </li>
            </ul>
            <p>
            This event was also a space for constructive exchange, highlighting the importance of the role of educational staff. Their observations, constructive criticism, and experience feedback are essential to optimize this game and make it a tool truly adapted to the needs of toddlers.
            </p>
            <p>
            Thanks to the mobilization and expertise of educational staff, this initiative promises to have a lasting impact on learning children's rights from their earliest age.
            </p>
            `,
          },
          videos1: {
            title: 'Exchange group of January 29, 2025',
            video1: {
              title: 'Video title',
              description: 'Video description',
            },
            video2: {
              title: 'Video title',
              description: 'Video description',
            },
            video3: {
              title: 'Video title',
              description: 'Video description',
            },
          },
          videos2: {
            title: 'Exchange group of March 12, 2025',
            video1: {
              title: 'Video title',
              description: 'Video description',
            },
            video2: {
              title: 'Video title',
              description: 'Video description',
            },
            video3: {
              title: 'Video title',
              description: 'Video description',
            },
          },
        },
      },
      card2: {
        title: 'Continuing Education',
        content: `
        <p>This project invites professionals to explore together new methods for raising children's awareness of their rights, combining educational tools, creative storytelling, and collective experience sharing.</p>
        `,
        trigger: 'View',
      },
      card3: {
        title: 'Monitoring and Scientific Analysis',
        content: `
        <p>Through questionnaires, observation grids, and rigorous data analysis, an evaluation of the evolution of professionals' perception as well as concrete effects on children was possible.</p>
        `,
        trigger: 'View',
      },
    },
  },
}
