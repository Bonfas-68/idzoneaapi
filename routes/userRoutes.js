import { validUser } from "../controllers/authController.js"
import { getAllUsers,  getUser,  updateUser } from "../controllers/userController.js"

const userRoutes = (app) =>{
    
    app.route("/users")
        .get(validUser, getAllUsers)
    app.route("/user/:id")
        .get(validUser, getUser)
        .put(validUser, updateUser)
}

export default userRoutes