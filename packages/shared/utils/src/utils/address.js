import { S } from "@mobily/ts-belt";
/**
 * Generates a Google Maps link from an address object
 */
export const makeGoogleMapUrl = (address) => {
    const addressString = `${address?.address ?? ""} ${address?.zip ?? ""} ${address?.city ?? ""} ${address?.state ?? ""} ${address?.country ?? ""}`;
    const cleanedAddress = addressString.replace(/[\r\n]+/g, " ");
    const sanitizedAddress = cleanedAddress.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const encodedAddress = encodeURIComponent(sanitizedAddress.replace(/\s+/g, "+"));
    const googleMapsLink = `https://www.google.com/maps/place/${encodedAddress}`;
    return googleMapsLink;
};
/**
 * Prettifies a zip code by adding a 'L-' prefix and padding with zeros
 */
export const prettifyZip = (zip) => {
    if (S.isEmpty(S.trim(zip)))
        return "";
    // Remove any non-digit characters
    const digitsOnly = zip.replace(/\D/g, "");
    // Format with 'L-' prefix
    return `L-${digitsOnly.padStart(4, "0")}`;
};
