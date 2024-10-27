import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }


})

export const Video = mongoose.model("Video" , videoSchema)