import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import env from 'dotenv'
import { Database } from "./dbs/init.mongodb.js";
import router from './routes/index.js'
env.config()


const app = express()

// init middleWare
app.use(morgan('dev')) // thông báo request
app.use(helmet()) // chống xem thông tin
app.use(compression()) // giảm tải
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init database
Database.getInstance()

// init router

app.use('/', router)


// hanlde err

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status : 'error',
        code: statusCode,
        message : error.message || 'Internal server error'
    })



})



export { app }