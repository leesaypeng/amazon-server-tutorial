const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/api/signup", async(req, res) =>{
    try{
        // get the data from client
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.
                status(400).
                json({msg: "Email address entered already exists"});
        }

        const hashPassword = await bcryptjs.hash(password, 8);
        
        let user = new User({
            email,
            password: hashPassword,
            name
        });

        user = await user.save();
        res.json(user);
        // _v, id   
        // post the data in database 
        // return the data to the user
    }catch(e){
        res.status(500).json({error: e.message});
    }
    
});

authRouter.post("/api/signin", async(req, res) =>{
    try{
        const {email, password } = req.body;

        // 检测邮件地址是否准确
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({msg: "User with this email doesn't exists"});
        }
        // 检测所输入的密码是否正确
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({msg: "Incorrect password"});
        }
        
        const token = jwt.sign({id: user._id}, "passwordKey");
        /*
            {
                "token": "token"
                "name": 'Rivaan',
                "email": "rrr@gmail.com",
            }
         */
        res.json({token, ...user._doc});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});

authRouter.post("/tokenIsValid", async (req, res)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if(!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        res.json(true);
    }catch(e){
        res.status(500).json({error: e.message});
    }
});

authRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});

module.exports = authRouter;