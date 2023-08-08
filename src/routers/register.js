const express = require("express");
const router = new express.Router();

const Register = require("../models/registers");

router.use(express.urlencoded({extended: false}));  

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword) {
            const registerAttendee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirmpassword : cpassword
            });

            // password hash (Middleware)
            
            //token generation
            const token = await registerAttendee.generateAuthToken();
            console.log("the register token part: "+token);

            // cookies
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),  //if not giving this then after refreshing page the cookie will be deleted
                httpOnly: true //client side scripting language cannot alter the cookie now
            });
            // console.log(cookie);

            const registered = await registerAttendee.save();
            console.log("the register page part: "+registered);

            res.status(201).render("index");
        } else {
            res.send("Password doesn't match");
        }
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;