import mongoose,{Schema} from "mongoose"

const student = new Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",           
        }
    ]
})

export const Student = mongoose.model('Student', student)