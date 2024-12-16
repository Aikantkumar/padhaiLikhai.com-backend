import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const publishAVideo = asyncHandler(async(req, res) => {
    const {title, description} = req.body

    if(!title){
        throw new ApiError(400, "Title is required");        
    }

    const videoFileLocalPath = req.file?.path

    const videoFile = uploadOnCloudinary(videoFileLocalPath)
    if(!videoFile){
        throw new ApiError(400, "Video is required");
    }

    const file = Video.create({
        title,
        description,
        file: videoFile.url
    })

    return res
    .status(200)
    .json(new ApiResponse(200, file, "Video has been published successfully"))

    
})

const getAllVideos = asyncHandler(async(req, res) => {
try {
    
        const {userId} = req.params
    
        if(!userId){
            throw new ApiError(400, "User Id is required")
        }
    
        const videos = Video.findById({
            user: userId
        })
    
        if(!videos.length){
            throw new ApiError(404, "No videos found")
        }
    
        return res
        .status(200)    
        .json(new ApiResponse(200, videos, "All Videos fetched successfully"))
    
} catch (error) {
    throw new ApiError(500, "Error while fetching the videos")
}
})

const deleteVideo = asyncHandler(async(req, res) => {
    try {
        const {videoId} = req.params
    
        if(!videoId){
            throw new ApiError(400, "Video Id is required")
        }
    
        const deleteVideo = Video.findByIdAndDelete(videoId)
    
        if(!deleteVideo){
            throw new ApiError(404, "Video not found")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, "Video deleted successfully"))
    } catch (error) {
        throw new ApiError(500, "Error while deleting the video")
    }
})


export {publishAVideo, getAllVideos, deleteVideo}