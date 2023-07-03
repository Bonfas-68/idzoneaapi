import config from "../db/config.js";
import mssql from "mssql";

export const createReply = async (req, res) => {
    const { user_id,idea_id,msg_id, reply_content,  reply_image } = req.body;
    try {
      const connect = await mssql.connect(config.sql);
      const result = await connect
        .request()
        .input("reply_content", mssql.VarChar, reply_content)
        .query("SELECT * FROM replys  WHERE reply_content = @reply_content");
      const reply = result.recordset[0];
      if (reply) {
        res.status(409).json({ error: "reply already exist" });
      } else {
        //add ideas
        await connect
          .request()
          .input("user_id", mssql.Int, user_id)
          .input("idea_id", mssql.Int, idea_id)
          .input("msg_id", mssql.Int, msg_id)
          .input("reply_image", mssql.VarChar, reply_image)
          .input("reply_content", mssql.VarChar, reply_content)
          .query(
            `INSERT INTO replys(reply_content, idea_id, user_id,msg_id, reply_image) VALUES(@reply_content,@msg_id,@idea_id, @user_id, @reply_image)`
          );
  
        res.status(200).json({ message: "Reply Created successfully!!" });
      }
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };