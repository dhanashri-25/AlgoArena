import express from 'express'
import {login,signup,logout,verify} from "../controllers/authController.js"
const authRouter=express.Router();
authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.get("/logout",logout);
authRouter.get("/verify",verify);
export default authRouter;