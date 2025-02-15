import mongoose, {Schema} from "mongoose";

const studentEnrollmentSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    field:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    state:{
        // which state of india
        type: String,
        required: true
    },
    studentId:{
        // mongodb wali "._id"
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    password:{
        type:String,
        required: [true, "Password is required"]
    },
    enrollments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
})


export const Enroll = mongoose.model("Enroll", studentEnrollmentSchema)