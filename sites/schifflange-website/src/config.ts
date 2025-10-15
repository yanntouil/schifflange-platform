export const config = {
  /**
   * environment
   */
  debug: true,
  inDevelopment: process.env.NODE_ENV === 'development',
  /**
   * paths to the services
   */
  api: process.env.NEXT_PUBLIC_API_URL ?? '',
  apiResource: process.env.NEXT_PUBLIC_API_RESOURCE_URL ?? undefined,
  dashboard: process.env.NEXT_PUBLIC_DASHBOARD_URL ?? '',
  app: process.env.NEXT_PUBLIC_APP_URL ?? '',

  /**
   * workspace config
   */
  workspaceId: process.env.NEXT_PUBLIC_WORKSPACE_ID ?? '',

  /**
   * site config
   */
  siteName: 'LumiQ', // seo
  siteType: 'website' as const, // seo

  /**
   * uploads
   */
  maxUploadFile: process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE
    ? Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE)
    : 32000000,

  // prettier-ignore
  acceptedFileExtensions: [
    "pdf", "jpg", "jpeg", "png", "svg", "webp", "gif", "tiff", "psd", "bmp",
    "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "rtf", "odt", "ods",
    "odp", "csv", "md", "json", "xml", "html", "css", "js", "jsx", "ts", "tsx",
    "mp3", "wav", "aac", "ogg", "midi", "flac", "mp4", "mov", "wmv", "avi",
    "mkv", "flv", "m4v", "mpg", "mpeg", "3gp", "zip", "rar", "7z", "gz", "bz2",
    "tar", "iso", "dmg", "exe", "msi", "bin", "jar", "apk", "eps", "ai",
    "indd", "raw", "heic", "heif", "webm", "fla", "swf", "qt", "msg", "eml",
    "vcard", "ics", "cr2", "nef", "orf", "sr2", "pdb", "dwg", "dxf", "cbr",
    "cbz", "vob", "m4a", "m4p", "m4b", "f4v", "f4a", "f4b", "f4p", "oga",
    "ogv", "ogx", "opus", "3g2", "3gp2", "3gpp", "3gpp2", "eot", "woff", "woff2", "ttf", "otf"
  ],
  // prettier-ignore
  acceptImageExtensions: ["jpg", "jpeg", "png", "gif", "svg", "webp", "tiff", "avif", "apng", "jfif", "pjpeg", "pjp"],

  /**
   * language config
   */
  disableLanguage: process.env.NEXT_PUBLIC_DISABLE_LANGUAGE === 'true',
  languages: process.env.NEXT_PUBLIC_LANGUAGES?.split(',') ?? ['en'],
  defaultLanguage: process.env.NEXT_PUBLIC_LANGUAGES_DEFAULT ?? 'en',
  cookieName: process.env.NEXT_PUBLIC_LANGUAGES_COOKIE ?? 'lang',

  /**
   * pages config
   */
  termsAndServices: 'legal-notice',
  privacyPolicy: 'privacy-policy',
}
