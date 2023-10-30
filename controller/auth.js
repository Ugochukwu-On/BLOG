const express = require('express')
const authRouter = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

authRouter.post('/register', async(req,res)=>{
    try {
        const isExisting = await User.findOne({email: req.body.email})
        if(isExisting){
            throw new Error ("Already Existing account")
        }
        const hashedPassword  = await bcrypt.hash(req.body.password, 10);
        const newUser =await User.create({...req.body, password: hashedPassword})
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '2d'})
        return res.status(201).json({ newUser, token})
    } catch (error) {
        res.status(500).json(error.message)
    }
    console.log(req.body, 'request body')
})


authRouter.post('/login', async(req,res)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            throw new Error ("Invalid Username or password")
        }
        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if(!comparePass){
            throw new Error("Invalid Username or password")
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '2d'})
        return res.status(201).json({user, token})
    } catch (error) {
        res.status(500).json(error.message)
    }
    console.log(req.body, 'request body')
})


module.exports = authRouter