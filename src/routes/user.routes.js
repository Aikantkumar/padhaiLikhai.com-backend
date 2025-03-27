import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, getUserChannelProfile, getUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createPlaylist, addVideoToPlaylist, getUserPlaylists, removeVideoFromPlaylist,  updatePlaylist, deletePlaylist, getVideosOfPlaylist } from "../controllers/playlist.controller.js"


const  router = Router()

// this was the route before adding the middleware:-
// router.route("/register").post(registerUser)
// here we have added a middleware "upload" we will use fields in which we have arrays
router.route("/register").post(
    // MULTER MIDDLEWARE(UPLOAD):
    upload.fields([
        {
            name:"avatar",
            maxCount:1 //no.of avatar files we need
        },
    ]), 
    registerUser)

    router.route("/login").post(loginUser)

    
    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("/refresh-token").post(refreshAccessToken)
    router.route("/change-password").post(verifyJWT, changeCurrentPassword)
    router.route("/current-user").get(verifyJWT, getCurrentUser)
    router.route("/update-account").patch(verifyJWT, updateAccountDetails) //here we are using 'patch' bcz if we use post then every data will get updated
    router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar) //verifyJWT and upload(multer) are the middlewares. we used "single" bcz we are passing only one file 
    router.route("/c/:userName").get(verifyJWT, getUserChannelProfile) //in 'getUserChannelProfile' we are getting the username from "req.params" so we need to write this type of routers. (c means channel here)
    router.route("/user-details/:userId").get(getUserDetails) 

    router.route("/playlists/:userId").post(createPlaylist)
    router.route("/playlists/:playlistId/videos/:videoId").post(addVideoToPlaylist)
    router.route("/:userId/playlists").get(getUserPlaylists)
    router.route("/playlists/:playlistId/videos/:videoId").delete(removeVideoFromPlaylist)
    router.route("/playlists/:playlistId").patch(updatePlaylist)
    router.route("/playlists/:playlistId").delete(deletePlaylist)
    router.route("/playlist/:playlistId").get(getVideosOfPlaylist)

    

export default router
