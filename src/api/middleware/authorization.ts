import { jwtVerifier } from "../../lib/okta";
import { Request, Response, NextFunction } from "express";

// // // //

/**
 * requireAuthenticated
 * Requires authentication for any request that passes through this middleware
 * Authorization middleware - rejects requests with missing, invalid, or expired tokens.
 * @param req
 * @param res
 * @param next
 */
export async function requireAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Isolates token
    let token = req.headers.authorization || null;

    // Reject requests without token
    if (!token) {
        // Returns 'missing token' message
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Authorization token missing." }));
        return;
    }

    // Attempt to verify token
    try {
        const accessToken = token.trim().split(" ")[1];
        const oktaResponse = await jwtVerifier.verifyAccessToken(
            accessToken,
            "api://default"
        );

        // Defines user.is_admin
        const is_admin: boolean = !!oktaResponse.claims.is_admin;

        // Updates req to include req.user
        // @ts-ignore
        req.user = {
            uuid: oktaResponse.claims.uid,
            username: oktaResponse.claims.sub,
            is_admin
        };

        // Continue through this middleware to the original request
        next();
    } catch (error) {
        next(error.message);
    }
}

/**
 * requireAdmin
 * Authorization middleware - rejects for non-admin users
 * @param req
 * @param res
 * @param next
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // Reject requests from non-admin users
    // Returns 'missing token' message
    // @ts-ignore
    if (!req.user.is_admin) {
        console.log("NOT ADMIN!");
        return res
            .status(401)
            .json({ error: "You are not authorized for this API endpoint" });
    }

    // Continue through this middleware to the original request
    next();
    return;
}

// // // //

// Rejects requests for non-admin users without the specified role
// export function requireRole = function (requiredRole) {

//   // Returns middleware function to check required role
//   const checkRole = (req, res, next) => {

//     // Reject requests from non-admin users
//     if (!req.user.admin && req.user.role !== requiredRole) {

//       // Returns 'missing token' message
//       return res.status(401).json({ error: 'You are not authorized for this API endpoint' });

//     }

//     // Continue through this middleware to the original request
//     next();
//     return;
//   }

//   // Returns checkRole function
//   return checkRole
// };
