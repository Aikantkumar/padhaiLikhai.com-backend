import mongoose, {Schema} from "mongoose";

const profileSchema = new Schema({
    // avatar,name, field(eg: class8-10, iit jee/neet), specialisation(eg: physics/chem), experience(if any), qualifications, achievements(if any), 
    avatar:{
        type: String,
        required: true
    },
    fullName:{
        type:String,
        required: true,
        trim: true,
        index: true,
        minLength: [4, "Full Name must contain atleast 4 characters"]
    },
    field:{
        type:String,
        required: true
    },
    specialisation:{
        type:String,
        required: true
    },
    experience:{
        type: String,
    },
    qualifications:{
        type: String,
        required: true
    }, 
    achievements:{
        type: String,
    },
    contact:{
        type: String,
        required: true
    }

})

export const Profile = mongoose.model("Profile", profileSchema)