// connecting to data base so calling connectDB from ./db where we have setup our database
import dotenv from "dotenv"
// require('dotenv').config({path: './env'})
import connectDB from './db/dbConnection.js'
import {app} from './app.js'

// we replaced this:-> "dev": "nodemon src/index.js" with a new dev command in 'package.json' which will help us to use "import" to import 'dotenv'
dotenv.config({
    path: './env'
})


// whenever the async method of dbconnection is completed(inside dbConnection.js) then it returns a promise so we will handle that response using ".then" and ".catch"
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED")
})
