import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const publishAVideo = asyncHandler(async(req, res) => {
    const {title} = req.body
    if(!title){
        throw new ApiError(400, "Title is required");        
    }

    
})

const getAllVideos = asyncHandler(async(req, res) => {})




export {publishAVideo, getAllVideos}