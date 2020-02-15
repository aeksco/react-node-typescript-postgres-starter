import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import { router } from "./routes";

// // // //

// Express.js App & Configuration
const app: express.Application = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan("dev"));

// Boostrap API routes - scopes all routes under /api
app.use("/api", router);

// // // //

// Exports Express app
export default app;
