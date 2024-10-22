import mongoose, { Schema } from "mongoose"

const notificationSchema = new Schema({
    message:{
        type: String,
        required: true
    },
    recipientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

export const Notification = mongoose.model("Notification", notificationSchema)