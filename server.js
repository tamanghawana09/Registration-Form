const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const nodeMailer = require('nodemailer')
const path = require('path')
const dotenv = require('dotenv')

const app = express()
dotenv.config()

const  port = process.env.PORT || 8000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.33ga9mm.mongodb.net/registrationFormDB`);

// Database Schema
const registrationSchema = new mongoose.Schema({
    new:String,
    email:String,
    password : String
});


// model of schema
const Registration = mongoose.model( "Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

app.post('/register', async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await Registration.findOne({email:{$regex:new RegExp(email,"i")}});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            });
             await registrationData.save();
             res.redirect("/success");
        }else{
            console.log("User already exist");
            res.redirect("/error");
        }
    }catch(e){
        console.log(e);
        res.redirect('/error');
    }
})


app.get('/success',(req,res)=>{
    res.sendFile(__dirname + "/success.html");
})
app.get('/error',(req,res)=>{
    res.sendFile(__dirname + "/error.html");
})






app.listen(port, ()=>{
    console.log(`Server is running in the port ${port}`)
})