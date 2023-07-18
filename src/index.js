import polka from 'polka';
import { json } from 'body-parser';
import bcrypt from 'bcrypt';

const express = require('express');
const bodyParser = require('body-parser');
const conDB = require('./config/db');
const jwt = require("jsonwebtoken");
const userModel = require('./userModel');

const app = polka();
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

const mongoose = require('mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Upsize:Upsize1@cluster0.jaqpvdo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connecting to mongoDB 
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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
    const {studentNumber, modules, password} = req.body 
  
    // hash the password 
    const hashedpassword = await bcrypt.hash(password, 10); 
    
    const newUser =  new userModel({
      studentNumber,
      modules,
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
  
  // This route handles user login by authenticating the user's modules and password
  // and generates a JSON Web Token (JWT) for subsequent authentication of protected routes
  // login route

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});