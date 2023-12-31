const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const bcrypt = require('bcrypt')
const User = require ('../model/User')
const userRouter = express.Router();

userRouter.get('/find/:userId', async(req,res)=>{
    try {
        const user = await User.findById(req.params.userId)
        if(!user){
            throw new Error ("User does not Exist")
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

userRouter.get('/findAll', async(req,res)=>{
    try {
        const users = await User.find({ })
        if(!users){
            throw new Error('No Users')
        }
        const formattedUsers =users.map((user)=>{
            return {username: user.username,
                 email: user.email,
                 _id: user.id,
                 createdAt: user.createdAt,
                 updatedAt: user.updatedAt
                }
        })
        return res.status(200).json(formattedUsers)

        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error.message)
 
    }
})

userRouter.put('/updateUser/:userId', verifyToken, async (req,res)=>{
    if(req.params.userId === req.user.id){
        try {
            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new:true})
            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).json(error.message)

        }
    }else {
        return res.status(403).json({msg:"You cannot Update this profile"})
    }
})
userRouter.delete('/deleteUser/:userId', verifyToken, async (req,res)=>{
    if(req.params.userId === req.user.id){
        try {
            await User.findByIdAndDelete(req.params.userId)
            return res.status(200).json({msg:'Successfully deleted'})
        } catch (error) {
            return res.status(500).json(error.message)

        }
    }else {
        return res.status(403).json({msg:"You cannot Delete this profile"})
    }
})

module.exports = userRouter