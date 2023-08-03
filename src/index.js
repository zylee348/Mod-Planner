import express from 'express';
import pkg from 'body-parser';
import bcrypt from 'bcrypt';
import { MongoClient, ServerApiVersion } from 'mongodb';

const { json } = pkg;
const app = express();
const port = process.env.PORT || 5000;

// Parse incoming requests with JSON payloads
app.use(json());

const uri = "mongodb+srv://Upsize:Upsize1@cluster0.jaqpvdo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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

app.get('/login', (req, res) => {
  res.render('./Login/Login'); // Render the login page (login.jsx)
});


// Add the login route and other routes here
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Fetch the user from the MongoDB database based on the provided username
  const user = await db.collection('users').findOne({ username });

  if (!user || user.password !== password) {
    // Failed login
    res.send('Invalid credentials. Please try again.');
  } else {
    // Successful login
    res.send('Login successful!');
  }
});

app.get('/register', (req, res) => {
  res.render('register'); // Render the register page (register.jsx)
});

// Define a route that registers users to the database
app.post('/register', async (req, res) => {
  const { studentNumber, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    studentNumber,
    modules,
    password: hashedPassword,
  });

  const userCreated = await newUser.save();
  if (!userCreated) {
    console.log("User cannot be created");
    return res.status(500).send("User cannot be created");
  } else {
    console.log("User has been created in the database");
    return res.status(200).send("User has been created in the database");
  }
});

