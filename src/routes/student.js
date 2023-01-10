import express from "express";
import { detailStudentController, studentController } from "../controllers/studentController.js";
const router = express.Router()

router.get('/', studentController)
router.get('/details', detailStudentController)
export default router