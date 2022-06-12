/**
 * SmartyStreetsSDK util
 *
 * getSuggestions() returns validate suggestions
 *   @param query - search key of street
 *
 * getValidatedAddressResult() returns updated (validated) info
 *   @param query - street info
 */

import * as SmartyStreetsSDK from "smartystreets-javascript-sdk";
import * as sdkUtils from "smartystreets-javascript-sdk-utils";
import config from '../config';

const SmartyStreetsCore = SmartyStreetsSDK.core;
const websiteKey = config.smartyStreetsKey;
const smartyStreetsSharedCredentials = new SmartyStreetsCore.SharedCredentials(websiteKey);
const autoCompleteClientBuilder = new SmartyStreetsCore.ClientBuilder(smartyStreetsSharedCredentials);
const usStreetClientBuilder = new SmartyStreetsCore.ClientBuilder(smartyStreetsSharedCredentials);

const autoCompleteClient = autoCompleteClientBuilder.buildUsAutocompleteClient();
const usStreetClient = usStreetClientBuilder.buildUsStreetApiClient();

export const getSuggestions = query => {
    let suggestions = [];
    const lookup = new SmartyStreetsSDK.usAutocomplete.Lookup(query);
    return autoCompleteClient.send(lookup)
    .then(response => {
        suggestions = response.result;
        return suggestions;
    })
    .catch(console.warn);
}

const validateAddress = query => {
    let lookup = new SmartyStreetsSDK.usStreet.Lookup();
    lookup.street = query.addressLine1;
    lookup.street2 = query.addressLine2;
    lookup.city = query.city;
    lookup.state = query.state;
    lookup.zipCode = query.zipCode;
    return usStreetClient.send(lookup)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}

export const getValidatedAddressResult = async query => {
    const response = await validateAddress(query);
    const lookup = response.lookups[0];
    const isValid = sdkUtils.isValid(lookup);
    const isAmbiguous = sdkUtils.isAmbiguous(lookup);
    const isMissingSecondary = sdkUtils.isMissingSecondary(lookup);
    const newState = {
        error: "",
        errorZipCode: false,
    };
    if (!isValid) {
        newState.error = "The address is invalid.";
    } else if (isAmbiguous) {
        newState.error = "The address is ambiguous.";
    } else if (isMissingSecondary) {
        newState.error = "The address is missing a secondary number.";
    } else if (isValid) {
        const candidate = lookup.result[0];
        newState.addressLine1 = candidate.deliveryLine1;
        newState.addressLine2 = candidate.deliveryLine2 || "";
        newState.city = candidate.components.cityName;
        newState.state = candidate.components.state;
        newState.zipCode = `${candidate.components.zipCode}`;
        newState.error = "";
    }
    return newState;
}
