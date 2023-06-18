import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";


const app=express();
app.use(cors());


app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());


async function findAll(req,res)
{
const uri="mongodb://127.0.0.1:27017";
const client=new MongoClient(uri);
const db=client.db("user");
const message=db.collection("message");

let list=  await message.find().toArray();
await client.close();
res.send(list);

}

async function addUserRecord(req, res) {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
  
    const db = client.db("project");
    const messageColl = db.collection("Contactus");
  
    let inputDoc = {
      name: req.query.name,
      subject: req.query.subject,
      email: req.query.email,
      number: req.query.number,
      message: req.query.message,
    
    };
    await messageColl.insertOne(inputDoc);
  
    await client.close();
  
    res.json({ opr: "success" });
  }
  async function loginByPost(req, res) {
    try {
      const uri = "mongodb://127.0.0.1:27017";
      const client = new MongoClient(uri);
  
      const db = client.db("project");
      const messageColl = db.collection("user");
  
      let query = { email: req.body.email, password: req.body.password };
      let userRef = await messageColl.findOne(query);
  
      await client.close();
  
      // Negative: UserRef CANBE NULL;
      if (!userRef) {
        let errorMessage = `Record Not Found or Authentication Failure: ${req.body.email}`;
        throw new Error(errorMessage);
      }
  
      // Postive Scenario
      res.json(userRef);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
app.get("/adduser", addUserRecord);
app.get("/main",main)
app.get("/findAll",findAll)
app.post("/login-by-post", loginByPost);
app.listen(4000);