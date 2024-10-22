import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {registerTeacher,getAllEnrollments } from "../controllers/teacher.controller.js"

const router = Router()

router.route("/register-teacher").post(
    upload.fields([
        {
        name:"avatar",
        maxcount:1
        }
    ]), registerTeacher)

router.route("/get-enrollments").get(getAllEnrollments)

export default router    