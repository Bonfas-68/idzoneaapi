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