import mongoose, { Schema } from "mongoose";
import moment from "moment"; //required in dob

const submitTestSchema = new Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
    },

    file: [
        // Array of file URLs or paths
        {
            type: String,
            required: true
        }
    ]


    // content:{
    //     type: String,
    //     required: true
    // },
    // // While content typically represents textual or main body information,
    // //  attachments cater to additional files like documents, images, audio clips, or any other relevant media.
    // attachments:[
    //     // Array of file URLs or paths
    //     {
    //         type:String,
    //         required: true
    //     }
    // ],

    // owner:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },

    // status:{
    //     type:String,
    //     enum:['pending', 'submitted']
    // },

    // submittedAt:{
    //     type: Date,
    //     default : Date.now
    // }

})

export const SubmitTest = mongoose.model("SubmitTest", submitTestSchema)