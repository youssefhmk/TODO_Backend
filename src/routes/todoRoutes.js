import express from "express"
import db from "../db.js"

const router = express.Router()
//get all the todos for a specific user
router.get("/",(req,res)=>{
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`)
    const todos = getTodos.all(req.userId)
    res.json(todos)
})
//create a new todo for a specific user
router.post("/",(req,res)=>{
    const {task} = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id,task) VALUES(?,?)`)
    const result = insertTodo.run(req.userId,task)
    res.json({ id: result.lastInsertRowid, user_id: req.userId, task })
})
//update a specific todo for a specific user(put request is used to modify a specific resource)

router.put("/:id",(req,res)=>{
    const {completed} = req.body
    const id = req.params.id
    const updatedTodo = db.prepare(
    'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?')
 updatedTodo.run(completed, id, req.userId)
    res.json({ message: "Todo completed" })
})
//delete a specific todo for a specific user
router.delete("/:id",(req,res)=>{
    const id = req.params.id
    const userId = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)
    res.json({ message: "Todo deleted" })
})
export default router