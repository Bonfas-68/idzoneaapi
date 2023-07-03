import express from "express";
import config from "./db/config.js";
import bcryptjs from "bcryptjs";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import { ideaRoutes } from "./routes/ideaRoutes.js";
import { commentRoute } from "./routes/commentsRoute.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import multer from "multer";
import sql from "mssql";
//start express
const app = express();

//middlewares
app.use(
  cors({
    origin: "https://calm-rock-09b49000f.3.azurestaticapps.net",
  })
);
//middleware should be executed before the routes
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Middleware to Check for user authorization to use protected resources
app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      config.jwt_secret,
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});
//routes
authRoutes(app);
userRoutes(app);
ideaRoutes(app);
commentRoute(app);
messageRoutes(app)

app.get("/", (req, res) => {
  res.send("Hello from idzoneaweb app!!");
});
// app.use("/images", express.static('images')); //using path lib to access images in folders

//setup multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads"); //null is error
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.user_image);
//   },
// });

// const upload = multer({ storage: storage }); //upload file

//set upload route
// app.post("/upload", upload.single("file"), async (req, res) => {
//   //single file upload
//   const { username, user_email, user_image, user_password } = req.body;
//   const hash = bcryptjs.hashSync(user_password, 10);
//   try {
//     const pool = sql.connect(config.sql);
//     // const result = await pool
//     //   .request()
//     //   .input("username", sql.VarChar, username)
//     //   .input("user_email", sql.VarChar, user_email)
//     //   .query(
//     //     "SELECT * FROM users WHERE username = @username OR user_email = @user_email"
//     //   );
//     // const user = result.recordset[0];
//     // if (user) {
//     //   res.status(409).json({ error: "User already exist" });
//     // } else {
//     // let pool =await sql.connect(config.sql);
       
//     await sql.connect(config.sql).request()
//         .input("username", sql.VarChar, username)
//         .input("user_image", sql.VarChar, user_image)
//         .input("user_email", sql.VarChar, user_email)
//         .input("user_password", sql.VarChar, hash)
//         .query(
//           `insert into users (username,user_email, user_image, user_password ) values (@username,@user_email, @user_image, ${hash})`
//         );
//       res.status(201).json({ message: "User created successfully" });
//     // }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log(err)
//   } finally {
//     // sql.close();
//   }
// });

app.listen(config.port, () => {
  console.log(`The server is running on ${config.url}`);
});
