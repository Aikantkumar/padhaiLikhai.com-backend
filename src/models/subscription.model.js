import mongoose, {Schema} from "mongoose";


// the subscriber is also a user and a channel is also a user.
const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User" // reference is taken from the user
    },

    channel:{
        type: Schema.Types.ObjectId, //one who is getting subscribed 
        ref: "User" // reference is taken from the user
    }
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)