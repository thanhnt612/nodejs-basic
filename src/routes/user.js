import express from "express";
import {
  createUserController,
  detailUserController,
  loginUserController,
  searchUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  refreshTokenController
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/search", searchUserController);

router.get("/getUser", authMiddleware, getUserController);

router.put("/update/:id", updateUserController);

router.delete("/delete/:id", deleteUserController);

router.get("/:userId", detailUserController);

router.post("/login", loginUserController);

router.post("/", createUserController);

router.post("/refreshToken", refreshTokenController);

export default router;
