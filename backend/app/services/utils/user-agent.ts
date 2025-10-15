import type { HttpContext } from '@adonisjs/core/http'
import DeviceDetector from 'device-detector-js'

/**
 * extractUserAgent
 */
export const extractUserAgent = (
  request: HttpContext['request']
): [boolean, ClientData & BotData] => {
  const userAgent = new DeviceDetector().parse(request.header('user-agent') ?? '')
  const isBot = userAgent.bot !== null
  if (isBot) {
    return [
      isBot,
      {
        client: {},
        os: {},
        device: {},
        bot: {
          name: userAgent?.bot?.name,
          category: userAgent?.bot?.category,
        },
      },
    ]
  }
  return [
    isBot,
    {
      client: {
        type: userAgent?.client?.type,
        name: userAgent?.client?.name,
        version: userAgent?.client?.version,
      },
      os: {
        name: userAgent?.os?.name,
        version: userAgent?.os?.version,
      },
      device: {
        type: userAgent?.device?.type,
      },
      bot: {},
    },
  ]
}

/**
 * ClientData
 */
export type ClientData = {
  client: {
    type?: 'browser' | 'feed' | 'library' | 'media player' | string
    name?: string
    version?: string
  }
  os: {
    name?: OperatingSystem | string
    version?: string
  }
  device: {
    type?: Device | string
  }
}

/**
 * BotData
 */
export type BotData = {
  bot: {
    name?: string
    category?: 'Crawler' | 'Validator' | 'Service Agent' | string
  }
}

/**
 * UserAgent
 */
export type UserAgent = ClientData & BotData & CoordData

/**
 * CoordData
 */
type CoordData = {
  coords: {
    latitude?: number
    longitude?: number
    precision?: number
  }
}

/**
 * UserAgentFull
 * type UserAgentFull = {
 *     type: 'browser' | 'feed' | 'library' | 'media player' | string
 *   client: {
 *     version: string
 *     name: string
 *   } | null
 *     engine: RenderingEngine
 *     name: OperatingSystem | string
 *   os: {
 *     platform: string
 *     version: string
 *   device: {
 *   } | null
 *     brand: string
 *     type: Device | string
 *   } | null
 *     model: string
 *     name: string
 *   bot: {
 *     url: string
 *     category: 'Crawler' | 'Validator' | 'Service Agent' | string
 *       name: string
 *     producer: {
 *     }
 *       url: string
 * }
 *   } | null
 */

/**
 * Device
 */
// prettier-ignore
export type Device = 'desktop' | 'smartphone' | 'tablet' | 'television' | 'smart display' | 'camera' | 'car' | 'console' | 'portable media player' | 'phablet' | 'wearable' | 'smart speaker' | 'feature phone' | 'peripheral'

/**
 * RenderingEngine
 */
// prettier-ignore
export type RenderingEngine = 'WebKit' | 'Blink' | 'Trident' | 'Text-based' | 'Dillo' | 'iCab' | 'Elektra' | 'Presto' | 'Gecko' | 'KHTML' | 'NetFront' | 'Edge' | 'NetSurf' | 'Servo' | 'Goanna'

/**
 * OperatingSystem
 */
// prettier-ignore
export type OperatingSystem = 'AIX' | 'Android' | 'AmigaOS' | 'Apple TV' | 'Arch Linux' | 'BackTrack' | 'Bada' | 'BeOS' | 'BlackBerry OS' | 'BlackBerry Tablet OS' 
  | 'Brew' | 'CentOS' | 'Chrome OS' | 'CyanogenMod' | 'Debian' | 'Deepin' | 'DragonFly' | 'Fedora' | 'Firefox OS' | 'Fire OS' | 'Freebox' | 'FreeBSD' | 'FydeOS' 
  | 'Gentoo' | 'Google TV' | 'HP-UX' | 'Haiku OS' | 'IRIX' | 'Inferno' | 'KaiOS' | 'Knoppix' | 'Kubuntu' | 'GNU/Linux' | 'Lubuntu' | 'VectorLinux' | 'Mac' 
  | 'Maemo' | 'Mandriva' | 'MeeGo' | 'MocorDroid' | 'Mint' | 'MildWild' | 'MorphOS' | 'NetBSD' | 'MTK / Nucleus' | 'MRE' | 'Nintendo' | 'Nintendo Mobile' 
  | 'OS/2' | 'OSF1' | 'OpenBSD' | 'Ordissimo' | 'PlayStation Portable' | 'PlayStation' | 'Red Hat' | 'RISC OS' | 'Rosa' | 'Remix OS' | 'RazoDroiD' | 'Sabayon' 
  | 'SUSE' | 'Sailfish OS' | 'SeewoOS' | 'Slackware' | 'Solaris' | 'Syllable' | 'Symbian' | 'Symbian OS' | 'Symbian OS Series 40' | 'Symbian OS Series 60' 
  | 'Symbian^3' | 'ThreadX' | 'Tizen' | 'TmaxOS' | 'Ubuntu' | 'watchOS' | 'WebTV' | 'Whale OS' | 'Windows' | 'Windows CE' | 'Windows IoT' | 'Windows Mobile' 
  | 'Windows Phone' | 'Windows RT' | 'Xbox' | 'Xubuntu' | 'YunOs' | 'iOS' | 'palmOS' | 'webOS'
