// when a student will register for course of a teacher.

import mongoose, {Schema} from "mongoose";
import moment from "moment"; //required in dob
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const courseregisterSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
        index: true
    },
    firstName:{
        type: String,
        required: true,
        trim:true,
        index: true,
        minLength: [3, "First Name must contain atleast 3 characters"]
    },
    lastName:{
        type: String,
        required: true,
        trim:true,
        index: true,
        minLength: [3, "Last Name must contain atleast 3 characters"]
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    gender:{
        type:String,
        required: true,
        enum: ["Male", "Female", "Others"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength: [8, "PASSWORD MUST CONTAIN 8 CHARACTERS"],
        select:false, //i.e when a user will login at our page then we can get all of his info except his password.
    }

})

export const Courseregister = mongoose.model("Courseregister", courseregisterSchema)