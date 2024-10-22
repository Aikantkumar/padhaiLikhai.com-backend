import { SubmitTest } from "../models/submitTest.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitTest = asyncHandler(async(req, res) => {
    const {owner, attachments, content, status} = req.body
    if(!attachments || !content || !owner){
        throw new ApiError(400, "Attachments are required")
    }

    // take the file from multer(which we had uploaded on multer middleware):-
    const testFileLocalPath = req.files?.attachments[0]?.path


    // upload on cloudinary and then we will get the url 
    // and we will upload the file's url to database
    const testFile = await uploadOnCloudinary(testFileLocalPath)

    if(!testFile){
        throw new ApiError(400, "attatchments or content is required")
        
    }

    const file = SubmitTest.create({
        owner,
        content,
        file: testFile.url,
        status: status || "submitted",
        attachments
    })

    return res
    .status(200)
    .json(new ApiResponse(200, file, "Test is submitted successfully"))

})

export { submitTest }