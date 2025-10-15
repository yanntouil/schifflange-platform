import React from "react"
import { IconType } from "./types"

export type ExtensionIconMap = {
  [extension: string]: {
    type: IconType
    component?: React.FC<React.SVGProps<SVGSVGElement>>
    background?: string
    foreground?: string
    icon?: string
    // rest from react-file-icon
    color?: string
    foldColor?: string
    uppercase?: boolean
    radius?: number
    gradientOpacity?: number
  }
}

export const extensionIconMap: ExtensionIconMap = {
  "3dm": {
    background: "#8D1A11",
    type: "3d",
  },
  "3ds": {
    background: "#5FB9AD",
    type: "3d",
  },
  "3g2": {
    type: "video",
    background: "#FF6B6B",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  "3gp": {
    type: "video",
    background: "#FF6B6B",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  "7z": {
    type: "compressed",
    background: "#9B59B6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  "7zip": {
    type: "compressed",
    background: "#9B59B6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  aab: {
    type: "android",
    background: "#3DDC84",
  },
  aac: {
    type: "audio",
    background: "#1DB954",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  aep: {
    type: "video",
    background: "#9999FF",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  ai: {
    type: "vector",
    color: "#423325",
    gradientOpacity: 0,
    background: "#423325",
    foreground: "#FF7F18",
    uppercase: true,
    foldColor: "#FF7F18",
    radius: 2,
  },
  aif: {
    type: "audio",
    background: "#1DB954",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  aiff: {
    type: "audio",
    background: "#1DB954",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  apk: {
    type: "android",
    background: "#3DDC84",
  },
  apkm: {
    type: "android",
    background: "#3DDC84",
  },
  apks: {
    type: "android",
    background: "#3DDC84",
  },
  asf: {
    type: "video",
    background: "#FF6B6B",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  asp: {
    type: "code",
    background: "#512BD4",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  aspx: {
    type: "code",
    background: "#512BD4",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  avi: {
    type: "video",
    background: "#FF6B6B",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  bin: {
    type: "binary",
    background: "#2C3E50",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  bmp: {
    type: "image",
    background: "#E74C3C",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  c: {
    type: "code",
    background: "#00599C",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  cpp: {
    type: "code",
    background: "#00599C",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  cs: {
    type: "code",
    background: "#512BD4",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  css: {
    type: "code",
    background: "#1572B6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  csv: {
    type: "spreadsheet",
    background: "#217346",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  cue: {
    type: "document",
    background: "#34495E",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  dll: {
    type: "settings",
    background: "#95A5A6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  dmg: {
    type: "drive",
    background: "#34495E",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  doc: {
    color: "#2C5898",
    foldColor: "#254A80",
    icon: "rgba(255,255,255,0.4)",
    background: "#2C5898",
    uppercase: true,
    type: "document",
  },
  docx: {
    color: "#2C5898",
    foldColor: "#254A80",
    icon: "rgba(255,255,255,0.4)",
    background: "#2C5898",
    uppercase: true,
    type: "document",
  },
  dwg: {
    type: "vector",
  },
  dxf: {
    type: "vector",
  },
  eot: {
    type: "font",
  },
  eps: {
    type: "vector",
  },
  exe: {
    type: "settings",
  },
  flac: {
    type: "audio",
  },
  flv: {
    type: "video",
  },
  fnt: {
    type: "font",
  },
  fodp: {
    type: "presentation",
  },
  fods: {
    type: "spreadsheet",
  },
  fodt: {
    type: "document",
  },
  fon: {
    type: "font",
  },
  gif: {
    type: "image",
  },
  gz: {
    type: "compressed",
  },
  heic: {
    type: "image",
  },
  htm: {
    type: "code",
  },
  html: {
    type: "code",
  },
  ics: {
    type: "calendar",
    background: "#4B2B36",
    foreground: "#FF408C",
    icon: "#FF408C",
  },
  indd: {
    color: "#4B2B36",
    type: "vector",
    gradientOpacity: 0,
    background: "#4B2B36",
    foreground: "#FF408C",
    uppercase: true,
    foldColor: "#FF408C",
    radius: 2,
  },
  ini: {
    type: "settings",
  },
  java: {
    type: "code",
  },
  jpeg: {
    type: "image",
  },
  jpg: {
    type: "image",
  },
  js: {
    background: "#F7DF1E",
    foreground: "#000000",
    icon: "#000000",
    type: "code",
  },
  json: {
    type: "code",
  },
  jsx: {
    background: "#00D8FF",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
    type: "code",
  },
  m4a: {
    type: "audio",
  },
  m4v: {
    type: "video",
  },
  max: {
    background: "#5FB9AD",
    type: "3d",
  },
  md: {
    type: "document",
  },
  mid: {
    type: "audio",
  },
  mkv: {
    type: "video",
  },
  mov: {
    type: "video",
  },
  mp3: {
    type: "audio",
  },
  mp4: {
    type: "video",
  },
  mpeg: {
    type: "video",
  },
  mpg: {
    type: "video",
  },
  obj: {
    type: "3d",
  },
  odp: {
    type: "presentation",
  },
  ods: {
    type: "spreadsheet",
  },
  odt: {
    type: "document",
  },
  ogg: {
    type: "audio",
  },
  ogv: {
    type: "video",
  },
  otf: {
    type: "font",
  },
  pdf: {
    background: "#D93831",
    type: "acrobat",
  },
  php: {
    background: "#8892BE",
    type: "code",
  },
  pkg: {
    type: "3d",
  },
  plist: {
    type: "settings",
  },
  png: {
    type: "image",
  },
  ppt: {
    color: "#D14423",
    foldColor: "#AB381D",
    icon: "rgba(255,255,255,0.4)",
    background: "#D14423",
    uppercase: true,
    type: "presentation",
  },
  pptx: {
    color: "#D14423",
    foldColor: "#AB381D",
    icon: "rgba(255,255,255,0.4)",
    background: "#D14423",
    uppercase: true,
    type: "presentation",
  },
  pr: {
    type: "video",
  },
  ps: {
    type: "vector",
  },
  psd: {
    color: "#34364E",
    type: "vector",
    gradientOpacity: 0,
    background: "#34364E",
    foreground: "#31C5F0",
    uppercase: true,
    foldColor: "#31C5F0",
    radius: 2,
  },
  py: {
    background: "#FFDE57",
    type: "code",
  },
  rar: {
    type: "compressed",
  },
  rb: {
    background: "#BB271A",
    type: "code",
  },
  rm: {
    type: "video",
  },
  rtf: {
    type: "document",
  },
  scss: {
    background: "#C16A98",
    type: "code",
  },
  sitx: {
    type: "compressed",
  },
  skp: {
    type: "3d",
  },
  svg: {
    type: "vector",
  },
  swf: {
    type: "video",
  },
  sys: {
    type: "settings",
  },
  tar: {
    type: "compressed",
  },
  tex: {
    type: "document",
  },
  tif: {
    type: "image",
  },
  tiff: {
    type: "image",
  },
  ts: {
    background: "#3478C7",
    type: "code",
  },
  tsx: {
    background: "#3478C7",
    type: "code",
  },
  ttf: {
    type: "font",
  },
  txt: {
    type: "document",
  },
  wav: {
    type: "audio",
  },
  webm: {
    type: "video",
  },
  wmv: {
    type: "video",
  },
  woff: {
    type: "font",
  },
  wpd: {
    type: "document",
  },
  wps: {
    type: "document",
  },
  xapk: {
    type: "android",
    background: "#3DDC84",
  },
  xlr: {
    type: "spreadsheet",
  },
  xls: {
    color: "#1A754C",
    icon: "rgba(255,255,255,0.4)",
    background: "#1A754C",
    uppercase: true,
    type: "spreadsheet",
  },
  xlsx: {
    color: "#1A754C",
    icon: "rgba(255,255,255,0.4)",
    background: "#1A754C",
    uppercase: true,
    type: "spreadsheet",
  },
  yml: {
    type: "code",
  },
  zip: {
    type: "compressed",
  },
  zipx: {
    type: "compressed",
    background: "#9B59B6",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  // Extensions supplémentaires populaires
  go: {
    type: "code",
    background: "#00ADD8",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  rs: {
    type: "code",
    background: "#CE422B",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  kt: {
    type: "code",
    background: "#7F52FF",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  swift: {
    type: "code",
    background: "#F05138",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  dart: {
    type: "code",
    background: "#0175C2",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  vue: {
    type: "code",
    background: "#4FC08D",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  less: {
    type: "code",
    background: "#1D365D",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  styl: {
    type: "code",
    background: "#FF6347",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  coffee: {
    type: "code",
    background: "#244776",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  webp: {
    type: "image",
    background: "#E74C3C",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  woff2: {
    type: "font",
    background: "#E67E22",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  xml: {
    type: "code",
    background: "#E34F26",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  yaml: {
    type: "code",
    background: "#CB171E",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  sh: {
    type: "code",
    background: "#89E051",
    foreground: "#000000",
    icon: "#000000",
  },
  bat: {
    type: "code",
    background: "#C1F12E",
    foreground: "#000000",
    icon: "#000000",
  },
  dockerfile: {
    type: "code",
    background: "#384D54",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
  sketch: {
    type: "vector",
    background: "#FDB300",
    foreground: "#000000",
    icon: "#000000",
  },
  fig: {
    type: "vector",
    background: "#F24E1E",
    foreground: "#FFFFFF",
    icon: "#FFFFFF",
  },
}
