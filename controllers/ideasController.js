import config from "../db/config.js";
import mssql from "mssql";

export const createIdea = async (req, res) => {
  const { user_id, idea_title, idea_text, idea_img } = req.body;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("idea_text", mssql.VarChar, idea_text)
      .query("SELECT * FROM ideas i WHERE idea_text = @idea_text");
    const idea = result.recordset[0];
    if (idea) {
      res.status(409).json({ error: "idea already exist" });
    } else {
      //add ideas
      await connect
        .request()
        .input("user_id", mssql.Int, user_id)
        .input("idea_title", mssql.VarChar, idea_title)
        .input("idea_img", mssql.VarChar, idea_img)
        .input("idea_text", mssql.VarChar, idea_text)
        .query(
          `INSERT INTO ideas(idea_text, idea_title, user_id, idea_img) VALUES(@idea_text,@idea_title, @user_id, @idea_img)`
        );

      res.status(200).json({ message: "Idea Created successfully!!" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
export const updateIdea = async (req, res) => {
  const { id } = req.params;
  const { idea_text} = req.body;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("idea_id", mssql.Int, id)
      .input("idea_text", mssql.VarChar, idea_text)
      .query(
        `SELECT * FROM ideas WHERE idea_text = @idea_text OR idea_id = ${id}`
      );
    const idea = result.recordset[0];
    if (!idea) {
      res.status(404).json({ error: "idea Not found" });
    } else {
      await connect
        .request()
        .input("idea_id", mssql.Int, id)
        .input("idea_text", mssql.VarChar, idea_text)
        .query(`UPDATE ideas SET idea_text = @idea_text WHERE idea_id = ${id}`);
      res.status(200).json({ message: "idea updated successfully!!" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  } finally {
    mssql.close();
  }
};
export const getIdeas = async (req, res) => {
  try {
    const connect = await mssql.connect(config.sql);
    // const result = await connect.request().query("SELECT * FROM ideas");
    const result = await connect.request().query(
      `SELECT u.user_id,u.user_image, u.username, u.user_email, i.idea_id, i.idea_img, i.idea_title, i.idea_text 
      FROM ideas i 
      Join users u ON i.user_id = u.user_id 
      ORDER BY i.idea_id DESC`
    );
    const ideas = result.recordset;
    res.status(200).json(ideas);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

export const getIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const connect = await mssql.connect(config.sql);
    //CHECK IF ideas present
    const result = await connect
      .request()
      .input("idea_id", mssql.Int, id)
      .query(`SELECT * FROM ideas WHERE idea_id = ${id}`);
    const idea = result.recordset[0];
    if (!idea) {
      res.status(409).json("idea not found");
    } else {
      await connect
        .request()
        .input("idea_id", mssql.Int, id)
        .query(`SELECT * FROM ideas WHERE idea_id = ${id}`);
      const idea = result.recordset[0];
      res.status(200).json(idea);
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  } finally {
    mssql.close();
  }
};
export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const connect = await mssql.connect(config.sql);
    //CHECK IF ideas present
    const result = await connect
      .request()
      .input("idea_id", mssql.Int, id)
      .query(`SELECT * FROM ideas WHERE idea_id = ${id}`);
    const idea = result.recordset[0];
    if (!idea) {
      res.status(409).json("idea not found");
    } else {
      await connect
        .request()
        .input("idea_id", mssql.Int, id)
        .query(`DELETE FROM ideas WHERE idea_id = ${id}`);
    }
    res.status(200).json({ message: "idea Deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  } finally {
    mssql.close();
  }
};
