import mssql from "mssql"
import config from "../db/config.js"

export const getAllUsers = async (req, res) =>{
    try {
        // let pool = await mssql.connect(config.sql)
        let connect = await mssql.connect(config.sql)
        const result = await connect.request().query("SELECT * FROM users")
        if(!result.recordset) return res.status(404).json({message: "Users not found"})
        res.status(200).json(result.recordsets[0])
    } catch (error) {
        res.status(404).json( error)
    }finally{
        mssql.close()
    }
}
export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const connect = await mssql.connect(config.sql);
      //CHECK IF ideas present
      const result = await connect
        .request()
        .input("idea_id", mssql.Int, id)
        .query(`SELECT * FROM users WHERE user_id = ${id}`);
      const user = result.recordset[0];
      if (!user) {
        res.status(409).json("user not found");
      } else {
        await connect
          .request()
          .input("user_id", mssql.Int, id)
          .query(`SELECT * FROM users WHERE user_id = ${id}`);
        const user = result.recordset[0];
        res.status(200).json(user);
      }
    } catch (err) {
      res.status(404).json({ error: err.message });
    } finally {
      // mssql.close();
    }
  };
 
  export const updateUser = async (req, res) => {
    const { id } = req.params;
    const {user_phone,username,user_location,user_email,user_bio,user_domain } = req.body;
    try {
      const connect = await mssql.connect(config.sql);
      const result = await connect
        .request()
        .input("user_id", mssql.Int, id)
        .input("user_email", mssql.VarChar, user_email)
        .query(
          `SELECT * FROM users WHERE user_email = @user_email OR user_id = ${id}`
        );
      const user = result.recordset[0];
      if (!user) {
        res.status(404).json({ error: "user Not found" });
      } else {
        await connect
          .request()
          .input("user_id", mssql.Int, id)
          .input("user_bio", mssql.VarChar, user_bio)
          .input("username", mssql.VarChar, username)
          .input("user_phone", mssql.VarChar, user_phone)
          .input("user_email", mssql.VarChar, user_email)
          .input("user_domain", mssql.VarChar, user_domain)
          .input("user_location", mssql.VarChar, user_location)
          .query(`UPDATE users SET user_phone='${user_phone}',username='${username}',user_location='${user_location}',user_email='${user_email}',user_bio='${user_bio}',user_domain='${user_domain}' WHERE user_id = ${id}`);
        res.status(200).json({ message: "User updated successfully!!" });
      }
    } catch (err) {
      res.status(404).json({ error: err });
    } finally {
      mssql.close();
    }
  };