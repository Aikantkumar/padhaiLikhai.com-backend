import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import {Notification} from "../models/notification.model.js"

const sendNotification = asyncHandler(async(req, res) => {
    try {
        const {message, recipientIds} = req.body

        if(!message || !recipientIds){
            throw new ApiError(400, "All fields are required");
        }

        // from frontend the teacher will write the message and will select the students whom we want to send notification.
        // const notifications
        // for(const recipientId of recipientIds) {
        //      notifications = Notification.create({
        //         message: message,
        //         recipientId: recipientId            
        //     })
        // }

        // here we are rendering the array "recipientIds" using maps, we will pick every recipientId and we will put a message to every recipient
        const notification = recipientIds.map(recipientId => ({
            message,
            recipient: recipientId
        }))

        // the code below is similar to the 'Notification.create' and it will save the data to the database
        const createdNotification = await Notification.insertMany(notification)

        if(!createdNotification){
            throw new ApiError(500, "Error while sending the notification")
        }

        return res
        .status(200)
        .json( new ApiResponse(200, createdNotification , "Notification sent successfully"))
    } catch (error) {
            throw new ApiError(500, "Error while sending notification")
               
    }
})

// function to get all notifications:
const getAllNotifications = asyncHandler(async(req,res) => {
    const notifications = await Notification.find()
    if(!notifications && notifications.length() === 0){
         new ApiError(400, "Error while fetching notifications")
    }

    return res
    .status(200)
    .json(200, notifications, "All Notifications fetched successfully")
})

export {sendNotification , getAllNotifications}