import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Test, Class, Assignment} from "../models/scheduled.model.js";
import cron from 'node-cron';

// the user  WILL GIVE THE DETAILS ABOUT THE TEST, CLASS, ASSIGNMENT i.e {title, description, schedule} AND WE WILL STORE THE DETAILS IN DATABASE, AND THEN USING THE FUNCTION 'scheduleTasks' WE WILL JUST SCHEDULE THE TASKS
// schedule Tests
const scheduleTest = asyncHandler(async(req, res) => {
    const {title, description, schedule} = req.body

    if(!title, !description, !schedule){
        throw new ApiError(400, "All fields are required")
    }

    const test = await Test.create({
        title,
        description,
        schedule,
        isScheduled: false
    })

    if(!test){
        throw new ApiError(400, "Something went wrong while scheduling the test")        
    }

    return res
    .status(200)
    .json(new ApiResponse(200, test, "Test sheduled successfully"))

})

// schedule classes
const scheduleClass = asyncHandler(async(req, res) => {
    const {title, description, schedule} = req.body

    if(!title, !description, !schedule){
        throw new ApiError(400, "All fields are required")
    }

    const clss = await Class.create({
        title,
        description,
        schedule,
        isScheduled: false
    })

    if(!clss){
        throw new ApiError(400, "Something went wrong while scheduling the class")        
    }

    return res
    .status(200)
    .json(new ApiResponse(200, clss, "Class sheduled successfully"))

})

// schedule assignments

const scheduleAssignments = asyncHandler(async(req, res) => {
    const {title, description, schedule} = req.body

    if(!title, !description, !schedule){
        throw new ApiError(400, "All fields are required")
    }

    const ass = await Assignment.create({
        title,
        description,
        schedule,
        isScheduled: false
    })

    if(!ass){
        throw new ApiError(400, "Something went wrong while scheduling the assignments")        
    }

    return res
    .status(200)
    .json(new ApiResponse(200, ass, "Assignments sheduled successfully"))

})



const setscheduleTasks = asyncHandler(async (req, res) => {
   try {
    //SCHEDULE TESTS
    //Fetch unscheduled tests and classes from the database using Test.find and Class.find. WE WILL FETCH THOSE TESTS WHICH ARE STORED IN THE DATABASE(SCHEMA) AS UNSCHEDULED i.e "isScheduled: false".
    // Test is the schema that connects us to the database    
    const unscheduledTests = await Test.find({ 
         isScheduled: false
      }); 
 
     // WE WILL USE A LOOP ON THE 'unscheduledTests' WHICH IS AN ARRAY OF THOSE TESTS WHICH ARE STORED WITH "isScheduled: false"
     // THIS VARIABLE "test" REPRESENTS EACH TEST IN THE ARRAY 
     unscheduledTests.forEach(test => {
         const scheduleTime = new Date(test.schedule); // THIS 'schedule' WE HAVE DEFRINED IT IN THE SCHEMA OF 'type: Date'
         // NOW WE WILL CONVERT THE DATE IN 'schedule' INTO THE FORM BELOW:-
         const cronTime = `${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`; 
         
         // THIS IS FROM WHERE THE ACTUAL CODE BEGINS:-
         cron.schedule(cronTime, async () => {
             console.log(`Running Test: ${test.title}`);
             
            //  NOTE:When the scheduled time arrives, it executes the code inside the cron.schedule function.

             //SO THIS FUNCTION WILL ACTUALLY CONVERT THE "isScheduled" AS TRUE
             test.isScheduled = true; 
              await test.save();
         }); 
     });
 
 
 
     //SCHEDULE CLASSES
 
     const unscheduledClasses = await Class.find({ 
         isScheduled: false
      }); 
 
     unscheduledClasses.forEach(cls => {
         const scheduleTime = new Date(cls.schedule); // THIS 'schedule' WE HAVE DEFRINED IT IN THE SCHEMA OF 'type: Date'
         // NOW WE WILL CONVERT THE DATE IN 'schedule' INTO THE FORM BELOW:-
         const cronTime = `${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`; 
         
         //  NOTE:When the scheduled time arrives, it executes the code inside the cron.schedule function.
         // THIS IS FROM WHERE THE ACTUAL CODE BEGINS:-
         cron.schedule(cronTime, async () => {
             console.log(`Running Test: ${cls.title}`); // Add code to execute the cls (e.g., send notifications, update status) 
             
            //  code to perform specific actions when the scheduled time for a test or class is reached.


             //SO THIS FUNCTION WILL ACTUALLY CONVERT THE "isScheduled" AS TRUE
             cls.isScheduled = true; 
              await cls.save();
         }); 
     });
 
 
      //SCHEDULE ASSIGNMENTS
 
      const unscheduledAssignments = await Assignment.find({ 
         isScheduled: false
      }); 
 
         unscheduledAssignments.forEach(ass => {
             const scheduleTime = new Date(ass.schedule); // THIS 'schedule' WE HAVE DEFRINED IT IN THE SCHEMA OF 'type: Date'
             // NOW WE WILL CONVERT THE DATE IN 'schedule' INTO THE FORM BELOW:-
             const cronTime = `${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`; 
             
            //  //  NOTE:When the scheduled time arrives, it executes the code inside the cron.schedule function.
             // THIS IS FROM WHERE THE ACTUAL CODE BEGINS:-
             cron.schedule(cronTime, async () => {
                 console.log(`Running Test: ${ass.title}`); // Add code to execute the test (e.g., send notifications, update status) 
                 
                 //SO THIS FUNCTION WILL ACTUALLY CONVERT THE "isScheduled" AS TRUE
                 ass.isScheduled = true; 
                  await ass.save();
                 }); 
             });
 
   } catch (error) {
      throw new ApiError(500, "Error while setting up the scheduled tasks");
      
   }

})
    
// for the students
const seeScheduledTest = asyncHandler(async (req, res) => {
    try {
        const tests = await Test.find({
            isScheduled: false
        })
    
        if(!tests || tests.length === 0){
            throw new ApiError(400, "No tests scheduled")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, tests, "Now you can see your scheduled Tests"))
    } catch (error) {
        throw new ApiError(500, "Error while loading the scheduled tests")
    }


}) 


const seeScheduledClass = asyncHandler(async (req, res) => {
    try {
        const classes = await Class.find({
            isScheduled: false
        })
    
        if(!classes || classes.length === 0){
            throw new ApiError(400, "No classes scheduled")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, classes, "Now you can see your scheduled Classes"))
    } catch (error) {
        throw new ApiError(500, "Error while loading the scheduled Classes")
    }
}) 


const seeScheduledAss = asyncHandler(async (req, res) => {
    try {
        const assgnmnts = await Assignment.find({
            isScheduled: false
        })
    
        if(!assgnmnts || assgnmnts.length === 0){
            throw new ApiError(400, "No tests scheduled")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, assgnmnts, "Now you can see your scheduled Assignments"))
    } catch (error) {
        throw new ApiError(500, "Error while loading the scheduled assignments")
    }
})


export {setscheduleTasks, scheduleTest, scheduleClass , scheduleAssignments, seeScheduledTest, seeScheduledClass, seeScheduledAss}