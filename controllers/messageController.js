import config from "../db/config.js";
import mssql from "mssql";

export const createMsg = async (req, res) => {
    const { receiver_id,sender_id,idea_id, msg_content,  msg_image } = req.body;
    try {
      const connect = await mssql.connect(config.sql);
      const result = await connect
        .request()
        .input("msg_content", mssql.VarChar, msg_content)
        .query("SELECT * FROM messages  WHERE msg_content = @msg_content");
      const message = result.recordset[0];
      if (message) {
        res.status(409).json({ error: "message already exist" });
      } else {
        //add ideas
        await connect
          .request()
          .input("sender_id", mssql.Int, sender_id)
          .input("receiver_id", mssql.Int, receiver_id)
          .input("idea_id", mssql.Int, idea_id)
          .input("msg_image", mssql.VarChar, msg_image)
          .input("msg_content", mssql.VarChar, msg_content)
          .query(
            `INSERT INTO messages(msg_content, idea_id, receiver_id, sender_id, msg_image) VALUES(@msg_content,@idea_id, @receiver_id, @sender_id, @msg_image)`
          );
  
        res.status(200).json({ message: "Message Created successfully!!" });
      }
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };
  //fetch all messages
  export const getMessages = async (req, res) => {
    try {
      const connect = await mssql.connect(config.sql);
      const result = await connect.request().query(
        `SELECT msg_content, idea_id, se.user_image AS sender_image, receiver_id, re.user_image AS receiver_image, sender_id, msg_image FROM messages msg
         join users se ON se.user_id = msg.sender_id
         join users re ON re.user_id = msg.receiver_id
        ORDER BY msg_id ASC`
      );
      const messages = result.recordset;
      res.status(200).json(messages);
    } catch (err) {
      res.status(404).json({ error: err });
    }
  };
  