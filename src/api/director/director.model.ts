import * as mongoose from "mongoose";

// // // //

const director_attributes = {
    name: {
        type: String,
        required: true,
        unique: false
    }
};

const collection_options = {
    timestamps: true,
    versionKey: false
};

const DirectorModel = new mongoose.Schema(
    director_attributes,
    collection_options
);

// // // //

export default mongoose.model("Director", DirectorModel);
