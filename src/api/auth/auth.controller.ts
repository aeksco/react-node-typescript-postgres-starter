import { Request, Response } from "express";
import { client as oktaClient, auth as oktaAuth } from "../../lib/okta";
// import User from "../user/user.model";

// // // //

// POST /api/auth/register
// { email, password }
export function register(req: Request, res: Response) {
    // return res.status(200).json({ registered: true });

    // Returns 400 error if req.body is not defined
    if (!req.body) return res.sendStatus(400);

    // Defines newUser object
    const newUser = {
        profile: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            login: req.body.email
        },
        credentials: {
            password: {
                value: req.body.password
            }
        }
    };

    // Create new user in Okta
    oktaClient
        .createUser(newUser)
        .then((user: any) => {
            res.status(201);
            res.send(user);

            // // // //
            // Creates new local User in MongoDB
            // const newModel = new User({
            //     okta_user_id: user.id,
            //     username: user.profile.email,
            //     firstName: user.profile.firstName,
            //     lastName: user.profile.lastName
            // });

            // // Saves new User in local MongoDB
            // newModel.save().then((resp: any) => {
            //     // Sends new Director to client
            //     return res
            //         .status(200)
            //         .send(resp)
            //         .end();
            // });
        })
        .catch((err: any) => {
            res.status(400);
            res.send(err);
        });
}

// // // //

// POST /api/auth/login
// { email, password }
export function login(req: Request, res: Response) {
    return res.status(200).json({ login: true });
}

// // // //

// POST /api/auth/forgot_password
export function forgot_password(req: Request, res: Response) {
    // return res.status(200).json({ success: true });
    console.log(req.body.email);

    // Pulls username from req.body.email
    const username = req.body.email || null;

    // Return 400 if username is falsey
    if (!username) {
        return res.status(400).json({ error: "No email provided" });
    }

    // TODO - handle missing req.body.email
    oktaAuth
        .forgotPassword({
            username,
            factorType: "EMAIL"
        })
        .then(function(transaction: any) {
            console.log("TRANSACTION???");
            console.log(JSON.stringify(transaction, null, 4));

            console.log(Object.keys(transaction));

            return res.json({ success: true });
        })
        .then(function(transaction: any) {
            if (transaction.status === "SUCCESS") {
                oktaAuth.session.setCookieAndRedirect(transaction.sessionToken);
            } else {
                throw "We cannot handle the " + transaction.status + " status";
            }
        })
        .fail(function(err: any) {
            console.error(err);
        });
}

// // // //

// POST /api/auth/reset_password
export function reset_password(req: Request, res: Response) {
    return res.status(403).json({ forbidden: true });
}
