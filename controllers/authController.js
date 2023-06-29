import mssql from "mssql";
import config from "../db/config.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
//destruture hashSync from the bcryptjs
// const { hashSync, compareSync } = bcryptjs;
export const validUser = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({error:"Unauthorzed user"});
  }
};
export const register = async (req, res) => {
  const { username, user_email, user_image, user_password } = req.body;
  //hash password before registering
  const hashedPassword = bcryptjs.hashSync(user_password, 10);
  try {
    //connect to database
    const connect = await mssql.connect(config.sql);
    //CHECK IF USERS REGISTERED
    const result = await connect
      .request()
      .input("username", mssql.VarChar, username)
      .input("user_email", mssql.VarChar, user_email)
      .query(
        "SELECT * FROM users WHERE username = @username OR user_email = @user_email"
      );
    const user = result.recordset[0];
    if (user) {
      res.status(409).json({ error: "User already exist" });
    } else {
      //Register user
      await connect
        .request()
        .input("username", mssql.VarChar, username)
        .input("user_email", mssql.VarChar, user_email)
        .input("user_image", mssql.VarChar, user_image)
        .input("user_password", mssql.VarChar, hashedPassword)
        .query(
            `INSERT INTO users(username, user_email,user_image, user_password) VALUES(@username, @user_email, @user_image, '${hashedPassword}')`
        );
      res.status(200).json({ message: "User Created successfully!!" });
    }
  } catch (error) {
    res.status(404).json(error);
  } finally {
    mssql.close();
  }
};
export const login = async (req, res) => {
  const { username, user_password } = req.body;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("username", mssql.VarChar, username)
      .query("SELECT * FROM users WHERE username = @username");
    const user = result.recordset[0];
    if (!user) {
      res
        .status(401)
        .json({ error: "Wrong Authentication,User not available" });
    } else {
      if (!bcryptjs.compareSync(user_password, user.user_password)) {
        res.status(401).json({ error: "Wrong Login credentials" });
      } else {
        const token = `JWT ${jsonwebtoken.sign(
          { username: user.username, email: user.user_email },
          config.jwt_secret,
          {
            expiresIn: "7d",
          }
        )}`;

        res
          .status(200)
          .json({
            user_id: user.user_id,
            username: user.username,
            user_email: user.user_email,
            user_image: user.user_image,
            token: token,
            message:"Login Successfull"
          });
      }
    }
  } catch (err) {
    res.status(404).json({ error: err });
  } finally {
    mssql.close();
  }
};
export const logout = async (req, res) => {};
