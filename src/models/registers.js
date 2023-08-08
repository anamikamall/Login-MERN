const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const attendeeSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    phone : {
        type: Number,
        required: true,
        unique: true
    },
    age : {
        type: Number,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    confirmpassword : {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// generating tokens
attendeeSchema.methods.generateAuthToken = async function(){
    try{
        const tokenn = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        // console.log(token);
        //saving token to db
        this.tokens = this.tokens.concat({token : tokenn})  //{token of db: generated token} if same write only once
        await this.save(); //to save
        return tokenn;
    } catch (e) {
        res.send("The error part " + error);
        console.log("The error part " + error );
    }
}

// converting password into hash
attendeeSchema.pre("save", async function(next) {  //this function will occur before save method
    if(this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10);
        // console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10); //this.password is the password entered by the user , and 10 is rounds
        // console.log(`The hashed password is ${this.password}`);
        // this.confirmpassword = undefined; //do not save confirm password
        this.confirmpassword = await bcrypt.hash(this.password, 10); 
    }
    next(); //will call the next method, save
})

const Register = new mongoose.model("Register", attendeeSchema);

module.exports = Register;