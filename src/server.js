import express from "express"
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js"
//path module is used to work with file and directory paths
//dirname is used to get the directory name of the current module
//  what is a mdoule? a module is a file that contains code that can be reused in other files
//fileURLToPath is used to convert a file URL to a path
//why we need to use fileURLToPath? because we are using ES modules and we need to get the path of the current module
import path,{dirname} from "path"
import { fileURLToPath } from "url"
const app = express()
const PORT = process.env.PORT || 5000
// __dirname is not available in ES modules, so we need to use fileURLToPath and dirname to get the directory name of the current module
//filename is the path of the current module, we can use it to get the directory name of the current module
const __filename =fileURLToPath(import.meta.url)
//dirname is the directory name of the current module, we can use it to get the path of the current module
const __dirname =dirname(__filename)
//express.json() is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
// It is used to parse the body of the request and make it available in req.body
app.use(express.json())
//express.static() is a built-in middleware function in Express.
//It serves static files such as images, CSS files, and JavaScript files. It is based on serve-static.
//you have to get the absolute path of the public folder because express.static() needs the absolute path of the folder to serve the static files
app.use(express.static(path.join(__dirname,"../public")))
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})
app.use("/todos",authMiddleware, todoRoutes)
//if the request is made to /auth, then the authRoutes will handle the request
app.use("/auth", authRoutes)
app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`))
