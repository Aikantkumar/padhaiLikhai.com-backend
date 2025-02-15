import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/teacherProfile.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Enroll } from "../models/studentEnroll.model.js"
import { User } from "../models/user.model.js";

// to register the teacher to make the profile of the teacher.
// const registerTeacher = asyncHandler(async (req, res) => {
//     // STEPS TO REGISTER THE TEACHER:-
//     // GET DETAILS OF THE TEACHER FROM req.body
//     // CHECK IF AVATAR IS PROVIDED OR NOT
//     // UPLOAD THE AVATAR ON CLOUDINARY
//     // MAKE AN OBJECT OF THE DETAILS AND UPLOAD TO MONGODB.
//     // CHECK IF TEACHER IS PROPERLY STORED IN THE DATABASE(MONGODB) OR NOT.
//     // GIVE RESPONSE 

//     // console.log("hnji kese ho")
//     const { fullName, field, specialisation, experience, qualifications, achievements, contact } = req.body

//     // console.log(req.body)
//     if ( !fullName || !field || !specialisation || !qualifications || !contact || !experience) {
//         throw new ApiError(400, "All fields are required")
//     }

//     // take the path of file from multer which was used as a middleware.
//     // const avatarLocalPath = req.files?.avatar[0]?.path

//     // if (!avatarLocalPath) {
//     //     throw new ApiError(400, "Avatar is not provided")
//     // }

//     // const avatar = await uploadOnCloudinary(avatarLocalPath);

//     // if (!avatar) {
//     //     throw new ApiError(400, "Avatar is not provided")
//     // }

//     // console.log("keveya shero")
//     // MAKE AN OBJECT OF THE DETAILS AND UPLOAD TO MONGODB.
//     const teacher = await Profile.create({
//         fullName,
//         field,
//         specialisation,
//         experience,
//         qualifications,
//         achievements,
//         contact,
//         // avatar:avatar.url
//     })

//     // The circular structure error usually indicates that some part of your MongoDB client is being included in the JSON response. To resolve this, avoid sending the entire createdTeacher object directly in the response. Instead, pick only the necessary fields.
//     const teacherResponse = await Profile.create({
//         fullName: teacher.fullName,
//         field: teacher.field,
//         specialisation: teacher.specialisation,
//         experience: teacher.experience,
//         qualifications: teacher.qualifications,
//         achievements:teacher.achievements,
//         contact: teacher.contact,
//         // avatar:teacher.avatar
//     })

//     //console.log(teacher)

//     // CHECK IF TEACHER IS PROPERLY STORED IN THE DATABASE(MONGODB) OR NOT.
//     const createdTeacher = Profile.findById(teacher._id)

//     if(!createdTeacher){
//         throw new ApiError(500, "Something went wrong while registering the Teacher")
//     }

//     //console.log("yha tak theek hai")

//     // GIVE RESPONSE   
//     return res
//     .status(200)
//     .json(new ApiResponse(200, teacherResponse , "You registered as a teacher successfully"))



// })

// function for teacher to get all enrollments (i.e the no. of students who has enrolled to the teacher)
const getAllEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enroll.find()

    return res
        .status(200)
        .json(new ApiResponse(200, enrollments, "All Enrollments fetched successfully"))
})

const enrollStudent = asyncHandler(async (req, res) => {
    const { teacherId, studentId } = req.body

    const existed = Enroll.findOne({ //update this
        enrollents: studentId
    })

    if (existed) {
        throw new ApiError(400, "You have already enrolled")
    }

    const newEnrollment = Enroll.findOneAndUpdate(
        // Updating the Enrollment Array: If not already enrolled, it uses $addToSet to add the studentId to the enrollments array for the specified teacherId.
        // Handling Document Creation: If no document matching the teacherId exists, the upsert option creates a new one.
        
        { teacherId: teacherId },
        { $addToSet: { enrollments: studentId }}, // Add studentId to enrollments array if it doesn't exist
        { new: true, upsert: true } // Create a new document if it doesn't exist( if a teacher doesnt exist then we will create a new entry of teacheriD and array of studentIds)                
    )


    const createdEnrollment = await Enroll.findById(newEnrollment._id)

    if (!createdEnrollment) {
        throw new ApiError(500, "Something went wrong while Enrolling")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdEnrollment, "User Enrolled successfully"))
})


const getAllTeacherProfiles6to8 = asyncHandler(async (req, res) => {
    try {
        const categories = [
            '6th-Mathematics', '6th-Science', '6th-SocialScience', '6th-Hindi', '6th-English', '6th-Sanskrit',
            '7th-Mathematics', '7th-Science', '7th-SocialScience', '7th-Hindi', '7th-English', '7th-Sanskrit',
            '8th-Mathematics', '8th-Science', '8th-SocialScience', '8th-Hindi', '8th-English', '8th-Sanskrit'
        ];

        // the $in operator within your MongoDB query to find any profiles where the field array includes any of the specified categories.

        const teacherProfiles = await User.find({ field: { $in: categories } })

        if (!teacherProfiles || teacherProfiles.length === 0) {
            throw new ApiError(400, "No teacher profiles found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, teacherProfiles, "All Teacher's Profiles fetched successfully"))
    } catch (error) {
        throw new ApiError(500, "Error while fetching the profiles");
    }
})



const getAllTeacherProfiles9to10 = asyncHandler(async (req, res) => {
    try {
        const categories = [
            '9th-Mathematics', '9th-Science', '9th-SocialScience', '9th-Hindi', '9th-English', '9th-Sanskrit',
            '10th-Mathematics', '10th-Science', '10th-SocialScience', '10th-Hindi', '10th-English', '10th-Sanskrit'
        ];

        // the $in operator within your MongoDB query to find any profiles where the field array includes any of the specified categories.

        const teacherProfiles = await User.find({ field: { $in: categories } })

        if (!teacherProfiles || teacherProfiles.length === 0) {
            throw new ApiError(400, "No teacher profiles found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, teacherProfiles, "All Teacher's Profiles fetched successfully"))
    } catch (error) {
        throw new ApiError(500, "Error while fetching the profiles");
    }
})
const getAllTeacherProfiles11to12 = asyncHandler(async (req, res) => {
    try {
        const categories = [
            '11th-Mathematics', '11th-Science', '11th-SocialScience', '11th-Hindi', '11th-English', '11th-Sanskrit',
            '12th-Mathematics', '12th-Science', '12th-SocialScience', '12th-Hindi', '12th-English', '12th-Sanskrit',

        ];

        // the $in operator within your MongoDB query to find any profiles where the field array includes any of the specified categories.

        const teacherProfiles = await User.find({ field: { $in: categories } })

        if (!teacherProfiles || teacherProfiles.length === 0) {
            throw new ApiError(400, "No teacher profiles found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, teacherProfiles, "All Teacher's Profiles fetched successfully"))
    } catch (error) {
        throw new ApiError(500, "Error while fetching the profiles");
    }
})

const getTeacherDetails = asyncHandler(async (req, res) => {
    try {
        const { teacherid } = req.params
        const teacherdata = User.findById({ teacherid })

        if (!teacherdata || teacherdata.length === 0) {
            throw new ApiError(400, "No teacher data found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, teacherdata, "Teacher's data fetched successfully"))

    } catch (error) {
        throw new ApiError(500, "Error while fetching the data");
    }
})


export { getAllEnrollments, getAllTeacherProfiles6to8, getAllTeacherProfiles9to10, getAllTeacherProfiles11to12, getTeacherDetails ,enrollStudent}