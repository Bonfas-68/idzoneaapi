import multer from "multer";
import { createMsg, getMessages } from "../controllers/messageController.js";
import { validUser } from "../controllers/authController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); //null is for error
  },
  filename: (req, file, cb) => {
    cb(null, req.body.msg_image);
  },
});

const upload = multer({ storage: storage }); //upload file

export const messageRoutes = (app)=>{
    app.route("/messages")
        .get(validUser,getMessages)
        .post(validUser, upload.single("file"), createMsg)
}