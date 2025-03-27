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
    description:{
        type: String,        
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // class: {// teacher will have to enter the class for which the video is for, so that the student can fetch videos using the class
    //    type: String,
    //     required: true 
    // }


})

export const Video = mongoose.model("Video" , videoSchema)