import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

// THIS IS A FUNCTION TO GENERATE TOKENS:-
const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // we often save the refreshtoken in our database so that we dont need to ask for the password again and again and we can give access to user just by refresh token
        // in the user(User(usermodel wala)) we have a seperate space for refreshtoken, so now we need to put the value of refreshtoken into the user object
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) // here we are just saving the user after putting the value of recfresh token and saving it without asking any validation 

        // we will return these tokens to the user
        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
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


    console.log("reached register function")
    // GET USER DETAILS FROM FRONTEND
    const { userName, firstName, lastName, email, dob, gender, password, role, field, specialisation, experience, qualifications, achievements, contact } = req.body

    console.log(req.body);
    if (!userName || !firstName || !lastName || !email || !password || !gender || !dob || !role) {
        throw new ApiError(400, "All fields are required")
    }

    // CHECK IF USER ALREADY EXISTS OR NOT USING HIS USERNAME OR EMAIL
    const existedUser = await User.findOne({
        //this "or" is used as an operator to check if anyone of them already exists then that means their exists a user with this userName or email. 
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists")
    }

    // console.log(req.files);

    // taking the path of avatar file from multer
    const avatarLocalPath = req.files?.avatar[0]?.path; //multer gives us access to the files. so first check that if we have access to files or not, then we want the file named avatar and then we got the path at which multer has uploaded the file on our localstorage 
    // CHECK IF AVATAR IS PROVIDED OR NOT:
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    // UPLOAD THE AVATAR TO CLOUDINARY:
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // check if the img is uploaded on cloudinary or not:
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    console.log("reached half function")
    // CREATE USER OBJECT SO THAT WE CAN SEND THAT TO MONGODB
    let user;

    if (role === "teacher") {
        if (!field || !specialisation || !qualifications || !contact || !experience) {
            throw new ApiError(400, "All teacher fields are required")
        }

        user = await User.create({
            userName: userName.toLowerCase(),
            firstName,
            lastName,
            email,
            dob,
            gender,
            avatar: avatar.url,
            password,
            role,
            field,
            specialisation,
            experience,
            qualifications,
            achievements,
            contact
        })
    }
    else{
        user = await User.create({
            userName: userName.toLowerCase(),
            firstName,
            lastName,
            email,
            dob,
            gender,
            avatar: avatar.url,
            password,
            role
        })
    }


   

    // to check if user is stored in the data or not. mongodb passes an id with every object stored in it. so we will use that to find that user in the storage
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    console.log("reached full function")
    // RETURN RESPONSE
    return res.status(201).json(
        // we have already made a structure/object of response ass 'ApiResponse' and we will send all things required in it.
        new ApiResponse(200, createdUser, "User Registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // STEPS:
    // TAKE DATA FROM THE req.body
    // FIND THE USER
    //CHECK PASSWORD
    // AFTER CHECKING THE PASSWORD NOW WE WILL GENERATE THE TOKENS(ACCESS AND REFRESH TOKEN)
    // SEND COOKIES 

    const { email, userName, password } = req.body;

    // console.log(req.body);

    if (!userName && !email) {
        throw new ApiError(400, "userName and email is required")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    // console.log(user)

    if (!user) {
        throw new ApiError(400, "User does not exist")
    }

    // console.log("chal rha hai")

    // "isPasswordCorrect" is a method made by us in usermodel to check the password using bcrypt
    const isPasswordValid = await user.isPasswordCorrect(password)
    // console.log("nahi chal rha")

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user credentials")
    }

    // AFTER CHECKING THE PASSWORD NOW WE WILL GENERATE THE TOKENS(ACCESS AND REFRESH TOKEN)
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // SEND COOKIES 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    // we need to remove the tokens
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

// now we will make a controller which will refresh the token which the user have,
// i.e if the access token of the user has expired so now we will have to check for his refresh token , if user has a valid refresh token,
// then we will give a new access token to the user(or we can say that we will refresh the accesstoken of the user)
// so now we will make this functionality:-
const refreshAccessToken = asyncHandler(async (req, res) => {
    // take the refresh token of the user either from his cookies or if the user is using a mobile and dont have cookies then take the refreshtoken from req.body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised request")
    }

    // here we are decoding the user's refresh token
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // NOW WE KNOW THAT WHEN WE CREATED THE REFRESH TOKEN(IN "generateRefreshToken" in userModel) then we only inserted an '_id' into refreshtoken,
        // SO WE CAN TAKE OUT THE '_id' FROM THE DECODED TOKEN(BCZ DECODED TOKEN HAS A LOT OF THINGS) AND USING THAT _id WE CAN ACTUALLY FIND THE INFO OF THAT USER FROM DATABASE:-
        const user = User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        // WE KNOW WE HAVE SAVED AND STORED THE ACTUAL REFRESH TOKEN OF THE USER IN "user" IN THE ABOVE FUNCTION "generateAccessAndRefreshTokens" IN "refreshToken"
        // NOW WE NEED TO COMPARE THE REFRESH TOKEN OF THE USER AND THE "refreshToken" WHICH IS SAVED IN THE DATABASE 

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refersh token is expired or used")
        }

        // NOW IF WE HAVE COMPARED PROPERLY SO NOW WE WILL GENERATE ANOTHER TOKEN FOR THE USER:-
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    // WE HAVE USED verifyJWT AS A MIDDLEWARE TO CHECK/VERIFY THE USER
    // now we KNOW THAT IF THE USER IS VERIFIED THAT MEANS IN THE AUTH-MIDDLEWARE(verifyJWT) THE INFO OF THE 'user' IS STORED IN 'req.user',
    // SO WE JUST NEED TO USE THAT 'req.user'.
    const user = await User.findById(req.user?._id)

    // check the password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    // if every thing is ok then: set the password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))



})

const getCurrentUser = asyncHandler(async (req, res) => {
    // now we KNOW THAT IF THE USER IS VERIFIED THAT MEANS IN THE AUTH-MIDDLEWARE(verifyJWT) THE INFO OF THE 'user' IS STORED IN 'req.user',
    // SO WE JUST NEED TO USE THAT 'req.user'.
    return res
        .status(200)
        .json(200, req.user, "Current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body
    if (!(fullName || userName)) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        // now we KNOW THAT IF THE USER IS VERIFIED THAT MEANS IN THE AUTH-MIDDLEWARE(verifyJWT) THE INFO OF THE 'user' IS STORED IN 'req.user',
        // SO WE JUST NEED TO USE THAT 'req.user'.
        req.user?._id,
        {
            $set: {
                firstName: firstName,
                lastName: lastName,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))


})


const updateUserAvatar = asyncHandler(async (req, res) => {
    // here we will use multer middleware so that we can upload files
    // and only the loggedin person can update the image/avatar

    //take the new avatar file from the user
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // upload on cloudinary:
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    // now update the avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "avatar image updated successfully")
        )


})

// TO GET THE OUR INFO i.e SUBSCRIBERS COUNT AND THE CHANNELS WHICH WE HAVE SUBSCRIBED USING AGGREGATE PIPELINES (duration: 16:00 in https://www.youtube.com/watch?v=fDTf1mk-jQg&list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&index=20 )
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params

    if (!userName?.trim()) {
        throw new ApiError(400, "UserName is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName
            }
        },
        {   //1st pipeline to find the subscribers of our channel
            // by selecting the channel we get subscribers
            // these "foreignField" we have put have came from "subscrition.model.js"
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

        {   //2nd pipeline to find whom we have subscribed to
            // by selecting the subscribers we get whom we have subscribed to.
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // AT THE FRONTEND WE HAVE A 'SUBSCRIBE' BUTTON SO EACH CHANNEL HAS A SUBSCRIBE BUTTON,
                // AND IF YOU ARE SUBSCRIBED THEN, IT SHOULD SHOW YOU "SUBSCRIBED" INSTEAD OF 'SUBSCRIBE' SO WE WILL SEND A TRU/FALSE DEPENDING UPON THAT YOU(USER) IS IN THE SUBSCRIBER'S LIST/DOCUMENT OR NOT.
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            // we will project only these things to a user, whenever he will look at his profile.
            $project: {
                userName: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                email: 1

            }
        }

    ])

    if (!channel?.length) {
        // channel is an array so if the length of channel is zero then that means there is nothing in that channel
        throw new ApiError(404, "Channel does not exist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )

})


const getUserDetails = asyncHandler(async (req, res) => {
    try {
        const user1Id = req.params
        const userdetails = await User.findById({ user1Id })

        if (!userdetails || userdetails.length === 0) {
            throw new ApiError(400, "No user details found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, userdetails, "User's all details fetched successfully"))


    } catch (error) {
        throw new ApiError(500, "Error while fetching user details");
    }


})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, getUserChannelProfile, getUserDetails }  