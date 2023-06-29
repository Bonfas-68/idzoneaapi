import multer from "multer";
import { login, register } from "../controllers/authController.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); //null is error
  },
  filename: (req, file, cb) => {
    cb(null, req.body.user_image);
  },
});

const upload = multer({ storage: storage }); //upload file
const authRoutes = (app) => {
  app.route("/auth/register").post(upload.single("file"),register);
  app.route("/auth/login").post(login);
};

export default authRoutes;
