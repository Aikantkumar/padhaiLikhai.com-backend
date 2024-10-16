import mongoose, {Schema} from "mongoose";
import moment from "moment"; //required in dob
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
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
    dob:{
        type: Date,
        required: [true, "DOB is required"],
        set: (value) => moment(value, 'DD/MM/YYYY').toISOString()

    },
    gender:{
        type:String,
        required: true,
        enum: ["Male", "Female", "Others"]
    },
    role:{
        type:String,
        required:true,
        enum:["Student", "Teacher"]

    },
    avatar:{
        type:String, //cloudinary url
        required:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength: [8, "PASSWORD MUST CONTAIN 8 CHARACTERS"],
        // select:false, //i.e when a user will login at our page then we can get all of his info except his password.
    },
    refreshToken:{
        type:String
    }

})

// we will use hooks of mongoose as middlewares just before the data getting saved.some of the hooks includes:- 'Pre'
// this will convert the password into "hash(#)"
// so whenever we will save/update the password in userSchema while registering, then we will convert the password into hash's.
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){// if the password is not modified
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); //duration "33:00" in "https://www.youtube.com/watch?v=eWnZVUXMq8k&list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&index=10"
    next()
});

userSchema.methods.isPasswordCorrect = async function(password){
    try {
        return await bcrypt.compare(password, this.password) //here password is the password just entered by the user and  this.password is the password is the original password already saved.
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
}

// generating jwt:
userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName, //"this.userName" is from backend
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)