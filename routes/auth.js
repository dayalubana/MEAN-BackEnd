var express = require('express')
var app = express();
var UserModel = require('../models/user')
var bcrypt  = require('bcryptjs')
var jwt  = require('jsonwebtoken')
app.post('/signup',async (req,res)=>{
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
    
        const oldUser = await UserModel.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        encryptedPassword = await bcrypt.hash(password, 10);
    
        const user = await UserModel.create({
          email: email.toLowerCase(), 
          password: encryptedPassword,
        });
    
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        res.status(201).json(token);
      } catch (err) {
        console.log(err);
      }
    }
)

app.post('/signin',async (req,res)=>{
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
            console.log('55555555');
          res.status(400).send("All input is required");
        }
        const user = await UserModel.findOne({ email });
        console.log(user);
        if (user && (await bcrypt.compare(password, user.password))) {
            // console.log('11111111111111');
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          res.status(200).json(token);
        } else{
            // console.log('333333333');
            res.status(400).send("Invalid Credentials");
        }
      } catch (err) {
        // console.log('2222222222');
        console.log(err);
    }
})

module.exports = app;