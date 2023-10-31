const express = require('express')
const authRouter = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

authRouter.post('/register', async (req, res) => {
    try {
        // Check if the user with the same email already exists
        const isExisting = await User.findOne({ email: req.body.email });
        if (isExisting) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the new user
        const newUser = await User.create({
            email: req.body.email,
            password: hashedPassword,
            // Include other user properties from req.body
        });

        // Generate a JWT token for the new user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

        // Respond with the newly created user and the token
        return res.status(201).json({ user: newUser, token });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


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