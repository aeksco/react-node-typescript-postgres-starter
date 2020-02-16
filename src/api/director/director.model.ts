import * as mongoose from "mongoose";

// // // //

const director_attributes = {
    name: {
        type: String,
        required: true,
        unique: false
    },
    user_id: {
        type: String,
        required: true
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
