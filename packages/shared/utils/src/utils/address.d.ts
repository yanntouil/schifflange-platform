export type GoogleMapAddress = {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};
/**
 * Generates a Google Maps link from an address object
 */
export declare const makeGoogleMapUrl: (address: Partial<GoogleMapAddress>) => string;
/**
 * Prettifies a zip code by adding a 'L-' prefix and padding with zeros
 */
export declare const prettifyZip: (zip: string) => string;
