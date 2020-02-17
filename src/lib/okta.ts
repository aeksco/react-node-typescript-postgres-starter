// NOTE - we add ts-ignore here beacuse the `@okta/okta-sdk-nodejs` doesn't have a types package
// @ts-ignore
import * as okta from "@okta/okta-sdk-nodejs";
// NOTE - we add ts-ignore here beacuse the `@okta/jwt-verifier` doesn't have a types package
// @ts-ignore
import * as OktaJwtVerifier from "@okta/jwt-verifier";
// NOTE - we add ts-ignore here beacuse the `@okta/jwt-verifier` doesn't have a types package
// @ts-ignore
import * as OktaAuth from "@okta/okta-auth-js";

// // // /

// Pulls requisite ENV variables from process.env
const { OKTA_ORG_URL, OKTA_TOKEN, OKTA_CLIENT_ID } = process.env;

/**
 * client
 * Exports an Okta client to interface with the OktaAPI
 * Used to register new users
 */
export const client = new okta.Client({
    orgUrl: OKTA_ORG_URL,
    token: OKTA_TOKEN
});

/**
 * jwtVerifier
 * Exports an Okta JWT Verifier to use in our authorization middleware
 * Used to verify a user's JWT during API requests
 */
export const jwtVerifier = new OktaJwtVerifier({
    issuer: `${OKTA_ORG_URL}/oauth2/default`,
    clientId: OKTA_CLIENT_ID,
    assertClaims: {
        // "groups.includes": ["Everyone"],
        cid: OKTA_CLIENT_ID
    }
});

export const auth = new OktaAuth({
    issuer: `${OKTA_ORG_URL}/oauth2/default`
});
