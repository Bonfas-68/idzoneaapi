import express from "express";
import config from "./db/config.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import { ideaRoutes } from "./routes/ideaRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
import { commentRoute } from "./routes/commentsRoute.js";
const app = express();

//middlewares
app.use(cors());
//middleware should be executed before the routes
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
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
profileRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello from idzoneaweb app!!");
});

app.listen(config.port || 5000, () => {
  console.log(`The server is running on ${config.url}`);
});
