import { validUser } from "../controllers/authController.js"
import { createIdea,  deleteIdea,  getIdea, getIdeas, updateIdea } from "../controllers/ideasController.js"

import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); //null is error
  },
  filename: (req, file, cb) => {
    cb(null, req.body.idea_img);
  },
});

const upload = multer({ storage: storage }); //upload file

export const ideaRoutes = (app)=>{
    app.route("/ideas")
        .get(validUser, getIdeas)
        .post(validUser, upload.single("file"), createIdea)
    app.route("/idea/:id")
        .get(validUser, getIdea)
        .put(validUser, updateIdea)
        .delete(validUser, deleteIdea)
}