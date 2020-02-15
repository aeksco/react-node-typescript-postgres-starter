// @ts-ignore
import okta from "@okta/okta-sdk-nodejs";
const { OKTA_ORG_URL, OKTA_TOKEN } = process.env;

/**
 * client
 * Exports an Okta client to interface with the OktaAPI
 */
export const client = new okta.Client({
    orgUrl: OKTA_ORG_URL,
    token: OKTA_TOKEN
});
