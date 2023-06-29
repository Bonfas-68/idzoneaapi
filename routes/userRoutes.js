import { validUser } from "../controllers/authController.js"
import { getAllUsers } from "../controllers/userController.js"

const userRoutes = (app) =>{
    
    app.route("/users")
        .get(validUser, getAllUsers)
}

export default userRoutes