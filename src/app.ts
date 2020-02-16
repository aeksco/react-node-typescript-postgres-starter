import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import * as graphqlHTTP from "express-graphql";
import schema from "./schema";
import { requireAuthenticated } from "./api/middleware/authorization";
import { router } from "./routes";

// // // //

// Express.js App & Configuration
const app: express.Application = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// print the request log on console
app.use(morgan("dev"));

// Boostrap API routes - scopes all routes under /api
app.use("/api", router);

app.use(
    "/graphql",
    requireAuthenticated,
    graphqlHTTP({ schema, graphiql: true })
);

// Exports Express app
export default app;
