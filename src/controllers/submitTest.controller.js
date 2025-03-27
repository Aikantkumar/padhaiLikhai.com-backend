import { SubmitTest } from "../models/submitTest.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitTest = asyncHandler(async(req, res) => {
    // const {owner, attachments, content, status} = req.body
    const {testId, studentId} = req.params
    //You don't need to explicitly mention the userId in the route if you're already sending it as part of the request body (req.body). When you define the owner field in your schema to reference the User model using mongoose.Schema.Types.ObjectId, you can pass the userId in the req.body when creating or updating a document.

    if(!testId || !studentId ){
        throw new ApiError(400, "testId and studentId are required")
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
        owner: studentId,
        test: testId,
        file: testFile.url,
    })

    return res
    .status(200)
    .json(new ApiResponse(200, file, "Test is submitted successfully"))

})

const getAllSubmissions = asyncHandler(async (req, res) => { 
    try { 
        const { testId } = req.params

        const submissions = await SubmitTest.find({
            test: testId
        }); 

        if (!submissions || submissions.length === 0) { 
            throw new ApiError(400, "No Submissions found")
        } 
        
        return res
        .status(200)
        .json(new ApiResponse(200, submissions, "All Submissions are fetched successfully"))
    } 
    catch (error) {
         throw new ApiError(500, "Error while fetching the Submissions")
    } 
});


const getAllTests = asyncHandler(async (req, res) => { 
    try { 
        const tests = await SubmitTest.find({}); 

        if (!tests || tests.length === 0) { 
            throw new ApiError(400, "No tests found")
        } 
        
        return res
        .status(200)
        .json(new ApiResponse(200, file, "All tests are fetched successfully"))
    } 
    catch (error) {
         throw new ApiError(500, "Error while fetching the tests")
    } 
});

export { submitTest, getAllTests, getAllSubmissions }