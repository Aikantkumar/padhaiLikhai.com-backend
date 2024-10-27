import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createPlaylist = asyncHandler(async(req, res) => {
    try {
        const {name, description} = req.body

        if(!name){
            throw new ApiError(400, "Name is required");
        }

        // store the playlist in the database 
        const playlist = await Playlist.create({
            name,
            description
        })

        if(!playlist){
            throw new ApiError(400, "Error while creating the playlist");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, "Your Playlist created successfully"))

    } catch (error) {
        console.error("Error while creating playlist")
        throw new ApiError(500, "Error while creating the playlist");
        
    }  
})

const addVideoToPlaylist = asyncHandler(async(req, res) => {
   try {
     // we will add the video using its mongodb-id 
     const {playlistId, videoId} = req.params
 
     if(!playlistId || !videoId){
         throw new ApiError(400, "playlistId and videoId are required");        
     }
 
     const playlist = await Playlist.findById(playlistId)
 
     if(!playlist){
         // A 404 error, also known as a "page not found" error
         throw new ApiError(404, "Playlist not found");        
     }
 
     const video = await Video.findById(videoId)
     
     if(!video){
         // A 404 error, also known as a "page not found" error
         throw new ApiError(404, "Video not found");        
     }
 
     // NOW JUST INSERT THE VIDEO INTO THE PLAYLIST
     // since in the playlist schema we initialised the 'videos' array(array of references to video IDs) i.e an array which consists of the ids of videos
     playlist.videos.push(videoId)
     await playlist.save()
 
     return res
     .status(200)
     .json(
         new ApiResponse(200, "Video added to the playlist successfully")
     )

   } catch (error) {
    throw new ApiError(500, "Error while adding video to the playlist");        
   }

})

// to get all playlists of the user
const getUserPlaylists = asyncHandler(async(req, res) => {
    try {
    
        const {userId} = req.params
    
        if(!userId){
            throw new ApiError(400, "user Id is required")
        }
    
        // we are searching for the playlist using userId bcz every playlist which the user has created might contain different playlist ID,
        // but in the playlist schema we have mentioned the id of user(owner), that means in mongo-storage, each playlist will be saved with the owner's id,
        // so if we want to search all the playlists then we know all the playlists will be stored in the 'Playlist' storage with one thing in common i.e owner's id
        const playlists = Playlist.findById({ //playlists is an array
                        user: userId
                    })
    
        if(!playlists.length){
            throw new ApiError(404, "No playlists found")
        }               
    
        // now we have all the playlists stored in the variable "playlists"
        return res
        .status(200)
        .json(new ApiResponse(400, playlists, "All playlists fetched successfully"))

    } catch (error) {
        throw new ApiError(500, "Error while fetching your playlists")
    }

})

const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    try {
        const {playlistId, videoId} = req.params
        if(!playlistId || !videoId){
            throw new ApiError(400, "playlistId and videoId are required")
        }
    
        const playlist = await Playlist.findById(playlistId)
        if(!playlist){
            throw new ApiError(404, "Cannot find playlist")
        }
    
        const video = Video.findById(videoId)
        if(!video){
            throw new ApiError(404, "Cannot find video")
        }
    
        playlist.videos.pull(videoId);
        await playlist.save();
    
        return res
         .status(200)
         .json(
             new ApiResponse(200, "Video removed from the playlist successfully")
         )

    } catch (error) {
        throw new ApiError(500, "Error while removing video from playlist")
    }

})

// to update the playlist(it's name, description)
const updatePlaylist = asyncHandler(async(req, res) => {
    try {
        const {playlistId} = req.params
        const {name, description} = req.body
    
        if(!playlistId){
            throw new ApiError(400, "playlistId is required")
        }
    
        if(!name || !description){
            throw new ApiError(400, "All fields are required")
        }
    
        const playlist = await Playlist.findByIdAndUpdate(playlistId,
            {
                $set:{
                    name,
                    description
                }
            },
            {
                new: true
            }
        )

        if(!playlist){
            throw new ApiError(400, "playlist not found")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, playlist , "Playlist updated successfully" ))

    } catch (error) {
        throw new ApiError(500, "Error while updating the playlist")
    }

})

const deletePlaylist = asyncHandler(async(req, res) => {
    try {
        const {playlistId} = req.params
        if(!playlistId){
            throw new ApiError(400, "playlistId is required")
        }
    
        const deletedplaylist = Playlist.findByIdAndDelete(playlistId)
        if(!deletedplaylist){
            throw new ApiError(404, "Playlist not found")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, deletedplaylist, "Playlist deleted successfully"))
    
    } catch (error) {
        throw new ApiError(500, "Error while deleting the Playlist")
    }
})




export { createPlaylist, addVideoToPlaylist, getUserPlaylists, removeVideoFromPlaylist,  updatePlaylist, deletePlaylist }