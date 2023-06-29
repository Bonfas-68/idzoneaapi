import { getProfile, updateProfile } from "../controllers/profileController.js"
import { validUser } from "../controllers/authController.js"

export const profileRoutes = (app)=>{
    app.route("/api/profile/:id")
        .get(validUser, getProfile)
        .put(validUser, updateProfile)
}