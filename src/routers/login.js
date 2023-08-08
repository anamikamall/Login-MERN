const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");

const Register = require("../models/registers");

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} ${password}`);
        const userEmail = await Register.findOne({email: email});  //will give database info    
        
        const isMatch =await bcrypt.compare(password, userEmail.password); //(entered , dbValue)

        //token generation
        const token = await userEmail.generateAuthToken();
        console.log("the login token part: "+token);

        res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),  
                httpOnly: true,
                // secure: true
            });

        // console.log(`This is the cookie ${req.cookie.jwt}`);

        // if(userEmail.password === password){
        if(isMatch){
            res.status(201).render("index");
        } else {
            res.send("Password doesn't match");
        }
    } catch {
        res.status(400).send("Invalid Email")
    }
});

module.exports = router;