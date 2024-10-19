import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Enroll } from "../models/studentEnroll.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const studentEnroll = asyncHandler(async (req, res) => {

    const { fullName, age, field, email, state, password } = req.body

    if (!fullName || !age || !field || !email || !state || !password) {
        throw new ApiError(400, "All fields are required")
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

    if(!createdStudent){
        ApiError(500, "Something went wrong while registering the Student")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, createdStudent, "Student registered Successfully"))

})




export { studentEnroll }