import { Translation } from "@compo/localize"
import {
  Archive,
  Calendar,
  Code,
  Codepen,
  Cog,
  File,
  FileMusic,
  FileTerminal,
  Image,
  Presentation,
  Shapes,
  Table,
  Text,
  Type,
  Video,
} from "lucide-react"
import React from "react"

export type IconType =
  | "3d"
  | "android"
  | "acrobat"
  | "audio"
  | "binary"
  | "calendar"
  | "code"
  | "compressed"
  | "document"
  | "drive"
  | "font"
  | "image"
  | "presentation"
  | "settings"
  | "spreadsheet"
  | "vector"
  | "video"
  | "unknown"
export const typeIconMap: {
  [key in IconType]: {
    component: React.FC<React.SVGProps<SVGSVGElement>>
    background: string
    foreground: string
    icon: string
  }
} = {
  "3d": {
    component: (props) => <Codepen {...props} />,
    background: "#8D1A11",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  android: {
    component: (props) => <File {...props} />,
    background: "#3DDC84",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  acrobat: {
    component: (props) => <File {...props} />,
    background: "#D93831",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  audio: {
    component: (props) => <FileMusic {...props} />,
    background: "#1DB954",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  binary: {
    component: (props) => <FileTerminal {...props} />,
    background: "#2C3E50",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  calendar: {
    component: (props) => <Calendar {...props} />,
    background: "#4B2B36",
    foreground: "#FF408C",
    icon: "#FF408C",
  },
  code: {
    component: (props) => <Code {...props} />,
    background: "#007ACC",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  compressed: {
    component: (props) => <Archive {...props} />,
    background: "#9B59B6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  document: {
    component: (props) => <Text {...props} />,
    background: "#2C5898",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  drive: {
    component: (props) => <File {...props} />,
    background: "#34495E",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  font: {
    component: (props) => <Type {...props} />,
    background: "#E67E22",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  image: {
    component: (props) => <Image {...props} />,
    background: "#E74C3C",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  presentation: {
    component: (props) => <Presentation {...props} />,
    background: "#D14423",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  settings: {
    component: (props) => <Cog {...props} />,
    background: "#95A5A6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  spreadsheet: {
    component: (props) => <Table {...props} />,
    background: "#217346",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  vector: {
    component: (props) => <Shapes {...props} />,
    background: "#FF7F18",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  video: {
    component: (props) => <Video {...props} />,
    background: "#FF6B6B",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  unknown: {
    component: (props) => <></>,
    background: "var(--muted)",
    foreground: "var(--muted-foreground)",
    icon: "var(--muted-foreground)",
  },
}

const dictionary = {
  en: {
    "3d": "3D",
    android: "Android",
    acrobat: "Acrobat",
    audio: "Audio",
    binary: "Binary",
    calendar: "Calendar",
    code: "Code",
    compressed: "Compressed",
    document: "Document",
    drive: "Drive",
    font: "Font",
    image: "image",
    presentation: "Presentation",
    settings: "Settings",
    spreadsheet: "Spreadsheet",
    vector: "Vector",
    video: "Video",
    unknown: "Unknown",
  },
  fr: {
    "3d": "3D",
    android: "Android",
    acrobat: "Acrobat",
    audio: "Audio",
    binary: "Binaire",
    calendar: "Calendrier",
    code: "Code",
    compressed: "Comprimé",
    document: "Document",
    drive: "Drive",
    font: "Police",
    image: "Image",
    presentation: "Présentation",
    settings: "Paramètres",
    spreadsheet: "Tableur",
    vector: "Vecteur",
    video: "Vidéo",
    unknown: "Inconnu",
  },
  de: {
    "3d": "3D",
    android: "Android",
    acrobat: "Acrobat",
    audio: "Audio",
    binary: "Binär",
    calendar: "Kalender",
    code: "Code",
    compressed: "Komprimiert",
    document: "Dokument",
    drive: "Laufwerk",
    font: "Schriftart",
    image: "Bild",
    presentation: "Präsentation",
    settings: "Einstellungen",
    spreadsheet: "Tabellenkalkulation",
    vector: "Vektor",
    video: "Video",
    unknown: "Unbekannt",
  },
} satisfies Translation
