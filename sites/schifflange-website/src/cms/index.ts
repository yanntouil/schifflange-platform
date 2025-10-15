import { AvailableItemTypes } from '@contents/lumiq/ssr'
import contentsBreadcrumbs from './contents/breadcrumbs'
import contentsNavigate from './contents/navigate'
import contentsRichText from './contents/rich-text'
import featuresActivities from './features/activities'
import featuresCards from './features/cards'
import featuresContacts from './features/contacts'
import featuresFaq from './features/faq'
import featuresProcess from './features/process'
import featuresVideos from './features/videos'
import headingsImage from './headings/image'
import headingsImages from './headings/images'
import headingsSimple from './headings/simple'
import headingsVideo from './headings/video'
import interactivesSubmitIdea from './interactives/submit-idea'
import mediasDocuments from './medias/documents'
import mediasImages from './medias/images'
import projectsFooter from './projects/footer'
import projectsLatest from './projects/latest'
import projectsProcess from './projects/process'
import projectsRelated from './projects/related'
import projectsSearch from './projects/search'

/**
 * registry items
 */
const items = {
  'contents-breadcrumbs': contentsBreadcrumbs,
  'contents-navigate': contentsNavigate,
  'contents-rich-text': contentsRichText,
  'features-cards': featuresCards,
  'features-contacts': featuresContacts,
  'features-activities': featuresActivities,
  'features-faq': featuresFaq,
  'features-process': featuresProcess,
  'features-videos': featuresVideos,
  'headings-image': headingsImage,
  'headings-images': headingsImages,
  'headings-simple': headingsSimple,
  'headings-video': headingsVideo,
  'interactives-submit-idea': interactivesSubmitIdea,
  'projects-process': projectsProcess,
  'projects-search': projectsSearch,
  'projects-latest': projectsLatest,
  'projects-related': projectsRelated,
  'projects-footer': projectsFooter,
  'medias-documents': mediasDocuments,
  'medias-images': mediasImages,
} satisfies Record<AvailableItemTypes, unknown>
export default items
