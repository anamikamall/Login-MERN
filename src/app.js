require('dotenv').config();  //to keep secret key private
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");


require("./db/conn");

const RegisterRouter = require("./routers/register");
const LoginRouter = require("./routers/login");

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");  //for views
const partials_path = path.join(__dirname, "../templates/partials");  //for partials

app.set('view engine', 'hbs'); //for using views
app.set('views', template_path);  //for changing views directory
hbs.registerPartials(partials_path);  //for using partials

app.use(express.json());
app.use(cookieParser()); //to use cookie parser as middleware
app.use(RegisterRouter);
app.use(LoginRouter);

app.use(express.static(static_path));
const auth = require("./middleware/auth");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/secret", auth , (req,res) => {
    console.log(`This is the secret cookie: ${req.cookies.jwt}`);
    res.render("secret");
});

app.get("/logout", auth, async(req, res) => {
    try {
        //to delete token from the db (for single logout)
        // req.user.tokens = req.user.tokens.filter((currElement) => {
        //     return currElement.token != req.token
        // });

        //logout from all devices
        req.user.tokens = [];

        //delete token from browser cookie
        res.clearCookie("jwt");
        console.log("Logout Succesful");

        await req.user.save();
        res.render("login");
    } catch(e) {
        res.status(500).send(e);
    }
})

app.listen(port , () => {
    console.log(`Listening to port ${port}`);
});