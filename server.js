require('dotenv').config
const express =  require ('express');
const app = express();
const path = require('path');
const connectDB = require('./config/connectDB');
const mongoose = require('mongoose');
const {logger} = require ('./middleware/logEvents');
const authRouter = require('./controller/auth')
const blogRouter = require('./controller/blog')
const userRouter = require('./controller/user')

//connect to mongoose
connectDB();


//middlewares controller/auth.js
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/user', userRouter);
app.use(logger);


const port = process.env.PORT ||3500; 
    app.listen(port,()=>{
        console.log(`server is running on ${port}`)
    })

