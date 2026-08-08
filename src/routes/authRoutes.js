import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../db.js"

const router = express.Router()
// /auth/register
router.post("/register",(req,res)=>{
//req body is an object that contains the data being sent to the server. It is usually used to send data to the server in a POST request. The data can be in the form of JSON, form data, or any other format. In this case, we are sending JSON data to the server.
 const {username,password} = req.body
 const hashedPassword = bcrypt.hashSync(password,8)
try{
 //write a query to insert the user into the database
 const insertUser =db.prepare(`INSERT INTO users (username,password) VALUES (?,?)`)
 const result = insertUser.run(username,hashedPassword)
 //create a todo for the user (default todo)
 const defaultTodo =`Hello ${username}, welcome to the app!`
 const insertTodo = db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`)
 insertTodo.run(result.lastInsertRowid,defaultTodo)
 //create a token for the user
 const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, { expiresIn: '24h' })
 res.json({ token })
}
catch(err){
    console.log(err)
}

})


router.post("/login",(req,res)=>{
const {username,password} = req.body
try{
    const getUser =db.prepare(`SELECT * FROM users WHERE username =?`)
    const user = getUser.get(username)
    //if user is not found, return error
    if(!user){
        return res.status(404).send({message:"User not found"})
    }
    //compare the password with the hashed password
    const passwordIsValid =bcrypt.compareSync(password,user.password)
    if(!passwordIsValid){
        return res.status(401).send({message:"Invalid password"})
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.json({ token })
} 
 catch(err){
    console.log(err)
 }
}
)
export default router