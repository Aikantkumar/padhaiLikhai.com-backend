import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // STEPS:-
    // GET USER DETAILS FROM FRONTEND
    // DO VALIDATION OF DATA GIVEN 
    // CHECK IF USER ALREADY EXISTS OR NOT USING HIS USERNAME OR EMAIL
    // CHECK IF AVATAR IS PROVIDED OR NOT.
    // UPLOAD THE AVATAR TO CLOUDINARY
    // CREATE USER OBJECT SO THAT WE CAN SEND THAT TO MONGODB
    // REMOVE PASSWORD AND REFRESH TOKEN FIELD FROM RESPONSE WHILE GIVING IT TO FRONTEND
    // CHECK IF USER IS PROPERLY CREATED OR NOT
    // RETURN RESPONSE



    // GET USER DETAILS FROM FRONTEND
    const {userName ,firstName ,lastName ,email ,dob ,gender ,role,avatar ,password} = req.body
    

    if(!userName || !firstName || !lastName || !email || !password || !gender || !dob || !role || !avatar){
        throw new ApiError(400, "All fields are required")
    }

    // CHECK IF USER ALREADY EXISTS OR NOT USING HIS USERNAME OR EMAIL
    const existedUser = User.findOne({
        //this "or" is used as an operator to check if anyone of them already exists then that means their exists a user with this userName or email. 
        $or: [{ userName },{ email }] 
    })
    
    if(existedUser){
        throw new ApiError(409, "User with this email or username already exists")
    }


    // taking the path of avatar file from multer
    const avatarLocalPath = req.files?.avatar[0]?.path; //multer gives us access to the files. so first check that if we have access to files or not, then we want the file named avatar and then we got the path at which multer has uploaded the file on our localstorage 
    // CHECK IF AVATAR IS PROVIDED OR NOT:
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // UPLOAD THE AVATAR TO CLOUDINARY:
    const avatarimg = await uploadOnCloudinary(avatarLocalPath)
    
    // check if the img is uploaded on cloudinary or not:
    if(!avatarimg){
        throw new ApiError(400, "Avatar is required")
    }

    // CREATE USER OBJECT SO THAT WE CAN SEND THAT TO MONGODB
    const user = User.create({
        userName: userName.toLowerCase(),
        firstName ,
        lastName ,
        email ,
        dob ,
        gender,
        role,
        avatar: avatarimg.url,
        password
    })

    // to check if user is stored in the data or not. mongodb passes an id with every object stored in it. so we will use that to find that user in the storage
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

     // RETURN RESPONSE
     return res.status(201).json(
        // we have already made a structure/object of response ass 'ApiResponse' and we will send all things required in it.
        new ApiResponse(200, createdUser, "User Registered successfully")
     )
})

export { registerUser }  