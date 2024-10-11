// connecting to data base so calling connectDB from ./db where we have setup our database
import dotenv from "dotenv"
// require('dotenv').config({path: './env'})
import connectDB from './db/dbConnection.js'

// we replaced this:-> "dev": "nodemon src/index.js" with a new dev command in 'package.json' which will help us to use "import" to import 'dotenv'
dotenv.config({
    path: './env'
})


connectDB();