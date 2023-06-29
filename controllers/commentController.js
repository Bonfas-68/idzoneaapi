import mssql from "mssql";
import config from "../db/config.js";
export const getComments = async (req, res) => {
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect.request()
      .query(`SELECT u.user_id,u.user_image,c.comment_id, u.username, i.idea_id, c.comment FROM comments c
            join users u ON c.user_id = u.user_id
            join ideas i ON c.idea_id = i.idea_id
          WHERE c.idea_id = i.idea_id
          ORDER BY c.comment_id DESC`);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(404).json({ error: err });
  } finally {
    // mssql.close();
  }
};

export const createComment = async (req, res) => {
  const { user_id, idea_id, comment } = req.body;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("comment", mssql.VarChar, comment)
      .query("SELECT * FROM comments WHERE comment = @comment");
    const newcomment = result.recordset[0];
    if (newcomment) {
      res.status(409).json({ error: "comment already exist" });
    } else {
      //add comments
      await connect
        .request()
        .input("idea_id", mssql.Int, idea_id)
        .input("user_id", mssql.Int, user_id)
        .input("comment", mssql.VarChar, comment)
        .query(
          `INSERT INTO comments(comment, user_id, idea_id) VALUES(@comment, @user_id, @idea_id)`
        );

      res.status(200).json({ message: "comment Created successfully!!" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  } finally {
    mssql.close();
  }
};

export const deleteComment = async (req, res) => {
  const {  id } = req.params;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("comment_id", mssql.Int, id)
      .query(`SELECT * FROM comments WHERE comment_id = ${id}`);
    const newcomment = result.recordset[0];
    if (!newcomment) {
      res.status(409).json({ error: "comment does not exist" });    
    } else {
      await connect
        .request()
        .input("comment_id", mssql.Int, id)
        .query(`DELETE FROM comments WHERE comment_id = ${id}`);
      res.status(200).json({ message: "comment deleted successfully!!" });
    }
  } catch (err) {
    res.status(404).json({ error: err });
  } finally {
    mssql.close();
  }
};
export const editComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("comment_id", mssql.Int, id)
      .query(`SELECT * FROM comments WHERE comment_id = ${id}`);
    const newcomment = result.recordset[0];
    if (!newcomment) {
      res.status(409).json({ error: "comment does not exist" });
    } else {
      //add comments
      await connect
        .request()
        .input("comment_id", mssql.Int, id)
        .input("comment", mssql.VarChar, comment)
        .query(`UPDATE comments SET comment = @comment WHERE comment_id = ${id}`);

      res.status(200).json({ message: "comment updated successfully!!" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  } finally {
    mssql.close();
  }
};
