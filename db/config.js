import dotenv from 'dotenv';
import assert from "assert";

dotenv.config()

const { PORT, SQL_SERVER, SQL_DB, SQL_PWD, SQL_USER, JWT_SECRET } = process.env

assert(PORT, "PORT is required")



const config={
    port: PORT,
    sql:{
        server: SQL_SERVER,
        database: SQL_DB,
        user: SQL_USER,
        password: SQL_PWD,
        options:{
            encrypt: true,
            trustServerCertificate: true
        }
    },    
    jwt_secret: JWT_SECRET
}
export default config