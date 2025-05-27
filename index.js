// 14.0 iniitial server setup by $ mkdir mil-11-m-58-career-code-job-server => cd mil-11-m-58-career-code-job-server =>  npm init => then install in one command "npm i express mongodb nodemon cors dotenv"
// 14.1 import cors express and run app and setup port
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// 16.3 due import move to the up
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// 15.0 mannually some data is input in data base. For this first go to mongodb server => cluster => browse collection => create database => fill the Database Name => Collection Name => then create. After created, in jobs u will find insert document. click on it and delete any data like ObjectID is present then paste ur data.

// 14.2 middleware
app.use(cors());
app.use(express.json());

// 17.0 for add new database user and password go to database access => Add New Database User => in Password Authentication enter user name: 'career_db_admin and in password use auto generated password which is "O4t3tOchGoC21XpN". Then Built-in Role will be admin then add user.

// 17.1 as we have to hide the user name and password so create .env file then type DB_USER=career_db_admin and DB_PASS=O4t3tOchGoC21XpN

// 16.0 now connect the server by going to cluster => connect => driver => copy the code and follow 16.1

// 16.1
// 17.2 dynamically use the DB_USER & DB_PASS with process.env
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmunlsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// 16.1
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 16.1 copy from the documentation
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // 18.1
    // Get the database and collection on which to run the operation
    const jobsCollections = client.db("carrerCode").collection("jobs");

    // 18.2 send the hotjobs data to ui after that u will find the data manually by typing in browser url "http://localhost:3000/jobs"
    app.get("/jobs", async (req, res) => {
      const cursor = await jobsCollections.find().toArray();
      res.send(cursor);
    });

    // 19.2 make the api for get the data by id to go to specific jobs
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollections.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); // 16.2 it must be commented
  }
}
run().catch(console.dir);

// 14.3 now in server terminal type nodemon index.js
app.get("/", (req, res) => {
  res.send("Job server is running");
});

app.listen(port, () => {
  console.log(`Job server is running on port ${port}`);
  //14.4 now in server terminal type nodemon index.js also type in browser url http://loclhost:3000
});
