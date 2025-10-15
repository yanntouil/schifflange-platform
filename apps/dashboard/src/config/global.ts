import { assert } from "@compo/utils"

const globalConfig = {
  app: assert(import.meta.env.VITE_APP_URL),
  api: assert(import.meta.env.VITE_APP_API_URL),
  frontend: import.meta.env.VITE_APP_FRONTEND_URL ?? "http://localhost:3000",
  siteName: "Compo",
  environment: assert(import.meta.env.VITE_APP_ENV),
  inProduction: import.meta.env.VITE_APP_ENV === "production",
  inDevelopment: import.meta.env.VITE_APP_ENV === "development",
  signin: {
    email: import.meta.env.VITE_APP_SIGNIN_EMAIL ?? "",
    password: import.meta.env.VITE_APP_SIGNIN_PASSWORD ?? "",
  },
  maxUploadFile: +(import.meta.env.VITE_APP_MAX_UPLOAD_FILE ?? 32),
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
}

export default globalConfig
