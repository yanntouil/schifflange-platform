import DeviceDetector from 'device-detector-js'

/**
 * Interface for device information
 */
export interface DeviceInfo {
  client: {
    type: string | null
    name: string | null
    version: string | null
  } | null
  os: {
    name: string | null
    version: string | null
  } | null
  device: {
    type: string | null
    brand: string | null
    model: string | null
  } | null
  bot: any | null
}

/**
 * Parse user agent string to extract device information
 * @param userAgentString The user agent string to parse
 * @returns Structured device information
 */
export function parseUserAgent(userAgentString: string): DeviceInfo {
  const detector = new DeviceDetector()
  const parsedUserAgent = detector.parse(userAgentString)

  return makeUserAgent(parsedUserAgent)
}

export const makeUserAgent = (
  parsedUserAgent: Partial<DeviceDetector.DeviceDetectorResult> = {}
) => {
  return {
    client: parsedUserAgent.client
      ? {
          type: parsedUserAgent.client.type,
          name: parsedUserAgent.client.name,
          version: parsedUserAgent.client.version,
        }
      : null,
    os: parsedUserAgent.os
      ? {
          name: parsedUserAgent.os.name,
          version: parsedUserAgent.os.version,
        }
      : null,
    device: parsedUserAgent.device
      ? {
          type: parsedUserAgent.device.type,
          brand: parsedUserAgent.device.brand,
          model: parsedUserAgent.device.model,
        }
      : null,
    bot: parsedUserAgent.bot,
  }
}

/**
 * Get a friendly name for a device based on its information
 * @param deviceInfo The device information object
 * @returns A user-friendly device name
 */
export function getDeviceName(deviceInfo: DeviceInfo): string {
  const parts = []

  // Add client info (browser/app)
  if (deviceInfo.client && deviceInfo.client.name) {
    parts.push(deviceInfo.client.name)
  }

  // Add OS info
  if (deviceInfo.os && deviceInfo.os.name) {
    parts.push(`on ${deviceInfo.os.name}`)
  }

  // Add device info
  if (deviceInfo.device && deviceInfo.device.brand) {
    const deviceParts = []
    if (deviceInfo.device.brand) deviceParts.push(deviceInfo.device.brand)
    if (deviceInfo.device.model) deviceParts.push(deviceInfo.device.model)
    if (deviceParts.length > 0) {
      parts.push(`(${deviceParts.join(' ')})`)
    }
  }

  return parts.length > 0 ? parts.join(' ') : 'Unknown device'
}

/**
 * Parse a JSON string containing device information
 * @param jsonString The JSON string to parse
 * @returns The parsed device information or a fallback object
 */
export function parseDeviceInfoString(jsonString: string | null): DeviceInfo {
  if (!jsonString) {
    return { client: null, os: null, device: null, bot: null }
  }

  try {
    return JSON.parse(jsonString) as DeviceInfo
  } catch (error) {
    return { client: null, os: null, device: null, bot: null }
  }
}
