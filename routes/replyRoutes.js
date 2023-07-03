import multer from "multer";
import { createReply } from "../controllers/replyController.js";
import { validUser } from "../controllers/authController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); //null is for error
  },
  filename: (req, file, cb) => {
    cb(null, req.body.reply_image);
  },
});

const upload = multer({ storage: storage }); //upload file

export const replyRoutes = (app)=>{
    app.route("/replys")
        .post(validUser, upload.single("file"), createReply)
}