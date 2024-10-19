import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/teacherProfile.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerTeacher = asyncHandler(async (req, res) => {
    // STEPS TO REGISTER THE TEACHER:-
    // GET DETAILS OF THE TEACHER FROM req.body
    // CHECK IF AVATAR IS PROVIDED OR NOT
    // UPLOAD THE AVATAR ON CLOUDINARY
    // MAKE AN OBJECT OF THE DETAILS AND UPLOAD TO MONGODB.
    // CHECK IF TEACHER IS PROPERLY STORED IN THE DATABASE(MONGODB) OR NOT.
    // GIVE RESPONSE 

    // console.log("hnji kese ho")
    const { fullName, field, specialisation, experience, qualifications, achievements, contact } = req.body

    // console.log(req.body)
    if ( !fullName || !field || !specialisation || !qualifications || !contact) {
        throw new ApiError(400, "All fields are required")
    }

    // take the path of file from multer which was used as a middleware.
    const avatarLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is not provided")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is not provided")
    }

    // console.log("keveya shero")
    // MAKE AN OBJECT OF THE DETAILS AND UPLOAD TO MONGODB.
    const teacher = await Profile.create({
        fullName,
        field,
        specialisation,
        experience,
        qualifications,
        achievements,
        contact,
        avatar:avatar.url
    })

    // The circular structure error usually indicates that some part of your MongoDB client is being included in the JSON response. To resolve this, avoid sending the entire createdTeacher object directly in the response. Instead, pick only the necessary fields.
    const teacherResponse = await Profile.create({
        fullName: teacher.fullName,
        field: teacher.field,
        specialisation: teacher.specialisation,
        experience: teacher.experience,
        qualifications: teacher.qualifications,
        achievements:teacher.achievements,
        contact: teacher.contact,
        avatar:teacher.avatar
    })

    //console.log(teacher)

    // CHECK IF TEACHER IS PROPERLY STORED IN THE DATABASE(MONGODB) OR NOT.
    const createdTeacher = Profile.findById(teacher._id)

    if(!createdTeacher){
        throw new ApiError(500, "Something went wrong while registering the Teacher")
    }

    //console.log("yha tak theek hai")

    // GIVE RESPONSE   
    return res
    .status(200)
    .json(new ApiResponse(200, teacherResponse , "You registered as a teacher successfully"))

    

})

export {registerTeacher}