import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Enroll } from "../models/studentEnroll.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const studentEnroll = asyncHandler(async (req, res) => {

    const { fullName, age, field, email, state, password } = req.body

    if (!fullName || !age || !field || !email || !state || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // finding the student in the database, bcz if the studnt is able to enroll and do these things, then that clearly means that,
    // the user/studnt is already registered or loggedin and his info(including password) will definitely be saved in the database,
    // so we will find his password in the database and will compare it with the password just givn by user/student.
    const user = User.findOne({email})

    const isPasswordOk = user.isPasswordCorrect(password)

    if(!isPasswordOk){
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

    if(!createdStudent){
        ApiError(500, "Something went wrong while registering the Student")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, createdStudent, "Student registered Successfully"))

})




export { studentEnroll }