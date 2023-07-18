import polka from 'polka';
import { json } from 'body-parser';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = polka();
const port = process.env.PORT || 5000;

// Parse incoming requests with JSON payloads
app.use(json());


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

// Define a route that registers users to the database
app.post('/register', async (req, res) => {
  const { studentNumber, modules, password } = req.body;

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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
