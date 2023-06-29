import config from "../db/config.js";
import mssql from "mssql";

//Read all dets
export const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect.request().input("user_id", mssql.Int, id)
      .query(`SELECT user_id, idea_id, idea_text FROM ideas 
      WHERE user_id = ${id}`);
    const profile = result.recordsets[0];
    // if (profile) {
      res.status(200).json(result.recordsets[0]);
    // } else {
      // res.status(409).json("Seems profile does not exist!!");
    // }
  } catch (err) {
    res.status(404).json({ error: err });
  } finally {
    mssql.close();
  }
};

//update dets
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { bio } = req.body;
  try {
    const connect = await mssql.connect(config.sql);
    const result = await connect
      .request()
      .input("bio", mssql.VarChar, bio)
      .query("SELECT bio FROM profile WHERE bio = @bio");
    const profile = result.recordset;
    if (!profile) {
      return res.status(409).json("bio does not exist");
    } else {
      await connect
        .request()
        .input("profile_id", mssql.Int, id)
        .input("bio", mssql.VarChar, bio)
        .query("UPDATE profile SET bio = @bio WHERE profile_id = @id");
      res.status(200).json("bio updated successfully!!");
    }
  } catch (err) {
    res.status(404).json({ error: err });
  } finally {
    mssql.close();
  }
};
