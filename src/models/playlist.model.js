import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    // name of playlist, description, all videos
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        
    },
    videos:[
        // this will be array of ids of videos(ids which they got when we we stored them in mongodb)
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    
    // owner of the playlist is the one who has created it
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

export const Playlist = mongoose.model("Playlist", playlistSchema)