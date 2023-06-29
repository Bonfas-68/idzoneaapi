import { validUser } from "../controllers/authController.js"
import { createComment, deleteComment, editComment, getComments } from "../controllers/commentController.js"

export const commentRoute = app =>{
    app.route("/api/comments")
        .get(validUser, getComments)
        .post(validUser, createComment)
    app.route("/api/comment/:id")
        .delete(validUser, deleteComment)
        .put(validUser, editComment)
}