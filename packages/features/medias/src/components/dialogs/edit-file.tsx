import {
  extractFormFilesToUpload,
  Form,
  FormFiles,
  FormFileType,
  FormInfo,
  FormInput,
  FormTextarea,
  useForm,
  validator,
} from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, match, prependHttp, S } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMediasService } from "../../service.context"
import { extensionToType, typeToExtension } from "../../utils"

/**
 * EditFileDialog
 */
export const EditFileDialog: React.FC<Ui.QuickDialogProps<Api.MediaFileWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-xl" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.MediaFileWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service, isAdmin } = useMediasService()
  const serviceFile = service.files.id(item.id)
  const { min, max } = validator
  const initialValues = {
    translations: useFormTranslatable(item.translations, { name: "", alt: "", caption: "" }),
    files: [] as FormFileType[],
    copyright: item.copyright,
    copyrightLink: item.copyrightLink,
  }
  const type = extensionToType(item.extension)
  const accept = type ? typeToExtension(type) : []

  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    validate: validator({
      name: [min(1, _("name-required")), max(255, _("name-max"))],
      alt: [max(255, _("alt-max"))],
      caption: [max(255, _("caption-max"))],
    }),
    onSubmit: async ({ values }) => {
      const file = A.head(extractFormFilesToUpload(values.files)) ?? undefined
      const payload = {
        translations: values.translations,
        copyright: values.copyright,
        copyrightLink: S.isNotEmpty(values.copyrightLink) ? prependHttp(values.copyrightLink) : "",
        file,
      }

      return match(await serviceFile.update(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("validation"))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { file } }) => {
          Ui.toast.success(_("updated"))
          if (mutate) await mutate(file)
          close()
        })
    },
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <Form.Fields name='translations'>
        <FormTranslatableTabs className='space-y-4'>
          {({ code }) => (
            <>
              <FormInput
                label={_("name-label")}
                name='name'
                placeholder={_("name-placeholder")}
                lang={code}
                maxLength={255}
                labelAside={<FormInfo title={_("name-label")} content={_("name-info")} />}
              />
              <FormInput
                label={_("alt-label")}
                name='alt'
                placeholder={_("alt-placeholder")}
                lang={code}
                maxLength={255}
                labelAside={<FormInfo title={_("alt-label")} content={_("alt-info")} />}
              />
              <FormTextarea
                label={_("caption-label")}
                name='caption'
                placeholder={_("caption-placeholder")}
                maxLength={1024}
                lang={code}
                labelAside={<FormInfo title={_("caption-label")} content={_("caption-info")} />}
              />
            </>
          )}
        </FormTranslatableTabs>
      </Form.Fields>
      {isAdmin && A.isNotEmpty(accept) && (
        <FormFiles
          label={_("file-label")}
          name='files'
          multiple={false}
          accept={accept}
          labelAside={<FormInfo title={_("file-label")} content={_("file-info")} />}
        />
      )}
      <FormInput
        label={_("copyright-label")}
        name='copyright'
        placeholder={_("copyright-placeholder")}
        maxLength={255}
        labelAside={<FormInfo title={_("copyright-label")} content={_("copyright-info")} />}
      />
      <FormInput
        label={_("copyright-link-label")}
        name='copyrightLink'
        placeholder={_("copyright-link-placeholder")}
        maxLength={255}
        type='url'
      />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Edit file information",
    description:
      "Optimize your file for accessibility and SEO. Well-described files improve user experience and search engine visibility.",
    "name-label": "File name",
    "name-placeholder": "e.g., Annual Report 2024",
    "name-required": "Name is required",
    "name-max": "Name must be less than 255 characters",
    "name-info": "A descriptive name helps you organize files and improves findability.",
    "alt-label": "Alternative text (Alt)",
    "alt-placeholder": "e.g., Graph showing revenue growth from 2020 to 2024",
    "alt-max": "Alt text must be less than 255 characters",
    "alt-info":
      "CRITICAL FOR ACCESSIBILITY: Alt text is read by screen readers for visually impaired users. It also appears when images fail to load and improves SEO. Describe what the image shows, not what it looks like.",
    "caption-label": "Caption",
    "caption-placeholder": "e.g., CEO presenting at the 2024 annual conference",
    "caption-info":
      "Captions provide context and additional information. They appear below images in galleries and articles. Use them to enhance understanding, not duplicate alt text.",
    "caption-max": "Caption must be less than 1024 characters",
    "file-label": "Replace file (admin only)",
    "file-info":
      "⚠️ IMPORTANT: You can only replace with the same file type to prevent breaking existing usage. For example, if this image is used in articles, replacing it with a PDF would cause display issues.",
    "copyright-label": "Copyright owner",
    "copyright-placeholder": "e.g., John Doe Photography or © 2024 Company Name",
    "copyright-info":
      "Credit the creator or rights holder. This protects intellectual property and shows respect for creators' work.",
    "copyright-link-label": "Copyright link",
    "copyright-link-placeholder": "e.g., https://photographer-portfolio.com",
    submit: "Save",
    updated: "File updated successfully",
    failed: "Failed to update file",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier les informations du fichier",
    description:
      "Optimisez votre fichier pour l'accessibilité et le SEO. Des fichiers bien décrits améliorent l'expérience utilisateur et la visibilité sur les moteurs de recherche.",
    "name-label": "Nom du fichier",
    "name-placeholder": "ex. Rapport Annuel 2024",
    "name-required": "Le nom est requis",
    "name-max": "Le nom doit contenir moins de 255 caractères",
    "name-info": "Un nom descriptif vous aide à organiser vos fichiers et améliore leur recherche.",
    "alt-label": "Texte alternatif (Alt)",
    "alt-placeholder": "ex. Graphique montrant la croissance du chiffre d'affaires de 2020 à 2024",
    "alt-max": "Le texte alternatif doit contenir moins de 255 caractères",
    "alt-info":
      "ESSENTIEL POUR L'ACCESSIBILITÉ : Le texte alternatif est lu par les lecteurs d'écran pour les personnes malvoyantes. Il apparaît aussi quand les images ne se chargent pas et améliore le SEO. Décrivez ce que montre l'image, pas son apparence.",
    "caption-label": "Légende",
    "caption-placeholder": "ex. PDG présentant lors de la conférence annuelle 2024",
    "caption-info":
      "Les légendes fournissent du contexte et des informations supplémentaires. Elles apparaissent sous les images dans les galeries et articles. Utilisez-les pour enrichir la compréhension, sans dupliquer le texte alternatif.",
    "caption-max": "La légende doit contenir moins de 1024 caractères",
    "file-label": "Remplacer le fichier (admin uniquement)",
    "file-info":
      "⚠️ IMPORTANT : Vous ne pouvez remplacer que par le même type de fichier pour éviter de casser l'usage existant. Par exemple, si cette image est utilisée dans des articles, la remplacer par un PDF causerait des problèmes d'affichage.",
    "copyright-label": "Propriétaire des droits",
    "copyright-placeholder": "ex. Jean Dupont Photographie ou © 2024 Nom de l'entreprise",
    "copyright-info":
      "Créditez le créateur ou le détenteur des droits. Cela protège la propriété intellectuelle et montre du respect pour le travail des créateurs.",
    "copyright-link-label": "Lien vers le copyright",
    "copyright-link-placeholder": "ex. https://portfolio-photographe.com",
    submit: "Enregistrer",
    updated: "Fichier mis à jour avec succès",
    failed: "Échec de la mise à jour du fichier",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Datei-Informationen bearbeiten",
    description:
      "Optimieren Sie Ihre Datei für Barrierefreiheit und SEO. Gut beschriebene Dateien verbessern die Benutzererfahrung und die Sichtbarkeit in Suchmaschinen.",
    "name-label": "Dateiname",
    "name-placeholder": "z.B. Jahresbericht 2024",
    "name-required": "Name ist erforderlich",
    "name-max": "Name muss weniger als 255 Zeichen enthalten",
    "name-info":
      "Ein beschreibender Name hilft Ihnen bei der Organisation von Dateien und verbessert die Auffindbarkeit.",
    "alt-label": "Alternativtext (Alt)",
    "alt-placeholder": "z.B. Grafik zeigt Umsatzwachstum von 2020 bis 2024",
    "alt-max": "Alternativtext muss weniger als 255 Zeichen enthalten",
    "alt-info":
      "WICHTIG FÜR BARRIEREFREIHEIT: Alternativtext wird von Screenreadern für sehbehinderte Benutzer vorgelesen. Er erscheint auch, wenn Bilder nicht geladen werden, und verbessert SEO. Beschreiben Sie, was das Bild zeigt, nicht wie es aussieht.",
    "caption-label": "Beschriftung",
    "caption-placeholder": "z.B. CEO präsentiert auf der Jahreskonferenz 2024",
    "caption-info":
      "Beschriftungen bieten Kontext und zusätzliche Informationen. Sie erscheinen unter Bildern in Galerien und Artikeln. Verwenden Sie sie zur Verbesserung des Verständnisses, nicht zur Duplizierung des Alternativtexts.",
    "caption-max": "Beschriftung muss weniger als 1024 Zeichen enthalten",
    "file-label": "Datei ersetzen (nur Admin)",
    "file-info":
      "⚠️ WICHTIG: Sie können nur mit demselben Dateityp ersetzen, um bestehende Verwendung nicht zu beschädigen. Zum Beispiel würde das Ersetzen eines in Artikeln verwendeten Bildes durch ein PDF Anzeigefehler verursachen.",
    "copyright-label": "Urheberrechtsinhaber",
    "copyright-placeholder": "z.B. Max Mustermann Fotografie oder © 2024 Firmenname",
    "copyright-info":
      "Nennen Sie den Ersteller oder Rechteinhaber. Dies schützt geistiges Eigentum und zeigt Respekt für die Arbeit der Ersteller.",
    "copyright-link-label": "Copyright-Link",
    "copyright-link-placeholder": "z.B. https://fotografen-portfolio.com",
    submit: "Speichern",
    updated: "Datei erfolgreich aktualisiert",
    failed: "Fehler beim Aktualisieren der Datei",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
