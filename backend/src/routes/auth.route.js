import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();//creating a router

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// two middlewares are used here 
// 1. protectRoute - to protect the route  
// 2. updateProfile - to update the profile of the user
router.put("/update-profile", protectRoute, updateProfile);

// called when page is refreshed
router.get("/check", protectRoute, checkAuth);

export default router;