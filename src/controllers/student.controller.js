import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Enroll } from "../models/studentEnroll.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Student } from "../models/student.model.js"
import { Video } from "../models/video.model.js"
import NodeCache from "node-cache"
const videoCache = NodeCache({ stdTTL: 3600 }) // cache for 1 hour

const studentEnroll = asyncHandler(async (req, res) => {

    const { fullName, age, field, email, state, password } = req.body

    if (!fullName || !age || !field || !email || !state || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // finding the student in the database, bcz if the studnt is able to enroll and do these things, then that clearly means that,
    // the user/studnt is already registered or loggedin and his info(including password) will definitely be saved in the database,
    // so we will find his password in the database and will compare it with the password just givn by user/student.
    const user = User.findOne({ email })

    const isPasswordOk = user.isPasswordCorrect(password)

    if (!isPasswordOk) {
        throw new ApiError(400, "Invalid User credentials")
    }


    const student = await Enroll.create({
        fullName,
        age,
        field,
        email,
        state,
        password
    })

    const createdStudent = Enroll.findById(student._id).select(
        "-password"
    )

    if (!createdStudent) {
        throw new ApiError(500, "Something went wrong while registering the Student")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdStudent, "Student registered Successfully"))

})

const enrollInCourse = asyncHandler(async (req, res) => {
    const { teacherId, studentId } = req.body

    const existed = await Student.findOne({
        _id: studentId,
        teachers: teacherId
    })

    if (existed) {
        throw new ApiError(400, "You have already enrolled to this teacher")
    }

    const newEnrollment = await Student.findOneAndUpdate(
        // Updating the Enrollment Array: If not already enrolled, it uses $addToSet to add the studentId to the enrollments array for the specified teacherId.
        // Handling Document Creation: If no document matching the teacherId exists, the upsert option creates a new one.

        { studentId: studentId },
        { $addToSet: { teachers: teacherId } }, // Add studentId to enrollments array if it doesn't exist
        { new: true, upsert: true } // Create a new document if it doesn't exist( if a student doesnt exist then we will create a new entry of studentId and array of teacherIds)                
    )


    const createdEnrollment = await Student.findById(newEnrollment._id)

    if (!createdEnrollment) {
        throw new ApiError(500, "Something went wrong while Enrolling")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdEnrollment, "User Enrolled successfully"))
})

const getAllVideosStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.params
    const { page = 1, limit = 10 } = req.query
    const cacheKey = `platylist:${studentId}:page:${page}:limit:${limit}`

    const cachedData = videoCache.get(cacheKey)
    if (cachedData) {
        return res.status(200).json(new ApiResponse(200, cachedData, "Fetched Successfully"))
    }


    try {
        const student = await Student.find({
            studentId: studentId
        })

        const videos = await Video.find({ owner: { $in: student.teachers } })
            .skip((page - 1) * limit)
            .limit(Number(limit))

        if (!videos || videos.length == 0) {
            throw new ApiError(400, "No Videos found")
        }

        // cache the paginated data
        videoCache.set(cacheKey, videos)

        return res
            .status(200)
            .json(new ApiResponse(200, videos, "All videos of all teachers fetched successfully"))

    } catch (error) {
        throw new ApiError(500, "Error while fetching the videos")
    }
})




export { studentEnroll, enrollInCourse, getAllVideosStudent }