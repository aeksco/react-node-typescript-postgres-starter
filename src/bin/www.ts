require("dotenv").config();
import app from "../app";
import * as mongoose from "mongoose";

// // // //

// Pulls MONGO_DB_URI from process.env, casts to string
const MONGO_DB_URI: string = String(process.env.MONGO_DB_URI);

// Mongoose Deprecations
// https://mongoosejs.com/docs/deprecations.html
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// // // //

// Connect to MongoDB
mongoose.connect(MONGO_DB_URI);

// Instantiates new Mongoose connection
const db = mongoose.connection;

// Handles Mongoose connection error
db.on("error", console.error);

// Open Mongoose connection
db.once("open", () => {
    // TODO - use Morgan for logging
    console.info("Connected to MongoDB...");

    // Starts Express App
    app.listen(process.env.PORT, () => {
        // TODO - use Morgan for logging
        console.info(`Express is running on port ${process.env.PORT}`);
    });
});
