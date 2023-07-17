require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const conDB = require('./config/db');
const jwt = require("jsonwebtoken");
const userModel = require('./userModel');

const app = express();
const port = process.env.PORT || 5000;

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());


// router handlers 
app.get('/home', (req, res) => {
  res.status(200).json('You are welcome');
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

require('dotenv').config()
const mongoose = require('mongoose');

// Connecting to mongoDB 
const url = process.env.MONGODB_URI // mongoDB connection URL save in .env file
const conDB = async() => {
  try {
    const connectDB = await mongoose.connect(url);
    if(connectDB){
      console.log("connected to the database");
    } else {
      console.log(error => error);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

module.exports = conDB;


// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Coonect to the database
conDB();


// router handlers 
app.get('/home', (req, res) => {
  res.status(200).json('You are welcome');
})

// Define a route that registers users to the database
app.post('/register', async(req, res) => {
    const {fullname, email, password} = req.body 
  
    // hash the password 
    const hashedpassword = await bcrypt.hash(password, 10); 
    
    const newUser =  new userModel({
      fullname,
      email,
      password: hashedpassword
    })
  
    const userCreated = await newUser.save()
    if(!userCreated) {
      console.log("user cannot be created");
      return res.status(500).send("user cannot be created")
    } else {
      console.log("user has been created to the database");
      return res.status(200).send("user has been created to the database")
    }
  });
  
  // This route handles user login by authenticating the user's email and password
  // and generates a JSON Web Token (JWT) for subsequent authentication of protected routes
  // login route

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});