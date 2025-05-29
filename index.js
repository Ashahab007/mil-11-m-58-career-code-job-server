// 14.0 iniitial server setup by $ mkdir mil-11-m-58-career-code-job-server => cd mil-11-m-58-career-code-job-server =>  npm init => then install in one command "npm i express mongodb nodemon cors dotenv"
// 14.1 import cors express and run app and setup port
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// 16.3 due import move to the up
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// 15.0 mannually some data is input in data base. For this first go to mongodb server => cluster => browse collection => create database => fill the Database Name => Collection Name => then create. After created, in jobs u will find insert applicationument. click on it and delete any data like ObjectID is present then paste ur data.

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

// 16.1 copy from the application documentation
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // 18.1
    // Get the database and collection on which to run the operation
    const jobsCollections = client.db("carrerCode").collection("jobs");

    // 23.7 as we need the applicants data to the server so created another db for applications
    const applicationsCollections = client
      .db("carrerCode")
      .collection("applications");

    // 18.2 send the hotjobs data to ui after that u will find the data manually by typing in browser url "http://localhost:3000/jobs"
    app.get("/jobs", async (req, res) => {
      // 28.4
      const email = req.query.email;
      // 28.5 get an empty object for 18.2 operation i.e user email is absence it will show the all jobs data
      const query = {};
      // 28.6 if user (recruiter) is present
      if (email) {
        query.hremail = email;
      }
      const cursor = await jobsCollections.find(query).toArray(); //now u can check in browser url http://localhost:3000/jobs?email=job.hr@cob.com

      // 18.2 commented due to we will send the data by 28.4 conditionally
      // const cursor = await jobsCollections.find().toArray();
      res.send(cursor);
    });

    // 28.3 making api for my posted jobs to show in ui (but we will not follow this because it is difficult to maintain because sometimes it needs to find the email by company name or deadline then need to create too many get operation which is difficult to maintain. so we follow 28.4)
    /* app.get("/jobsbyemail", async (req, res) => {
      const email = req.query.email;
      const query = { hremail: email };
      const result = await jobsCollections.find(query).toArray();
      res.send(result);// if u type in browser url http://localhost:3000/jobsbyemail?email=job.hr@cob.com u will get the jobs posted by specific email
    }); */

    // 19.2 make the api for get the data by id to go to specific jobs
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollections.findOne(query);
      res.send(result);
    });

    // 27.6 creating the api for save the job application to db

    app.post("/jobs", async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollections.insertOne(newJob);
      res.send(result);
    });

    // 24.3 creating my application api to find the applicant by email and show in ui
    app.get("/applications", async (req, res) => {
      const email = req.query.email;
      const query = { applicant: email }; //as we send the applicant data in applicant key from the form to db. so we will query by applicant: email

      const result = await applicationsCollections.find(query).toArray();

      // 26.0 But my requirement is show the job data that the applicant's applied (this is the bad method but we have to know)
      for (const application of result) {
        const jobId = application.jobId; //set the job id for query
        const jobQuery = { _id: new ObjectId(jobId) };
        const job = await jobsCollections.findOne(jobQuery);
        application.title = job.title;
        application.company = job.company;
        application.company_logo = job.company_logo;
      }

      // 24.3
      res.send(result); // from this step u can check in browser url using query string(?) "http://localhost:3000/applications?email=job@cob.com" or "http://localhost:3000/applications?email=ashahab007@gmail.com"
      // Note: if u need multiple query use (&) example "http://localhost:3000/applications?email=ashahab007@gmail.com&age=29"
    });

    // 29.4 creating the api of view applications i.e how many applicants are apply for current jobs
    app.get("/applications/job/:job_id", async (req, res) => {
      //একটা application এর particular job এর id গুলো নিব।
      const job_id = req.params.job_id;

      const query = { jobId: job_id }; //this jobId is created when user applied for the jobs we send specific job id to jobId key.

      const result = await applicationsCollections.find(query).toArray();
      res.send(result); //Now in browser url type http://localhost:3000/applications/job/68381e7bd1a23916a09f7939 to see the applicants
    });

    // 23.8 created api for sending form data to the server using post method
    app.post("/applications", async (req, res) => {
      //the application data is come to the req.body
      const application = req.body;
      console.log(application);
      const result = await applicationsCollections.insertOne(application);
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
