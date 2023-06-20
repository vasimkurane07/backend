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
// Update operation
async function update(req,res){
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  const db = client.db("project");
  const messageColl = db.collection("Contactus");
const objectIdToUpdate = ObjectId('648edfc4fa910ff4d8f4dc86');
messageColl.updateOne(
  { _id: objectIdToUpdate },
  { $set: { name: "xyz", subject: 'testing', number: '000' } },
  function(err, result) {
    if (err) {
      console.error('Error updating the document', err);
      return;
    }
    
    console.log('Document updated successfully');
  }
);
}

async function addUserRegist(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("register-customer");

    let inputDoc = {
      Name: req.query.Name,
      email: req.query.email,
      password: req.query.password,
      
      mobile: req.query.mobile,
      city: req.query.city,
      pincode: req.query.pincode,
      address: req.query.address,
      
    };
    await messageColl.insertOne(inputDoc);

    await client.close();

    res.json({ opr: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
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
      const messageColl = db.collection("register-customer");
  
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

  async function login(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db("project");
    const messageColl = db.collection("register-customer");

    let record = {
      email: req.query.email,
      password: req.query.password,
    };

    let user = await messageColl.findOne(record);

    if (!user) {
      let errorMessage = `Record not found or Authentication failure: ${req.query.email}`;
      throw new Error(errorMessage);
    }

    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
}
async function booking(req,res){
  const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db("project");
    const messageColl = db.collection("booking");
    let input={
      date:req.query.date,
    fname:req.query.fname,
    lname:req.query.lname,
    mobile:req.query.mobile,
    members:req.query.members,
    cmembers:req.query.cmembers,
  }
  await messageColl.insertOne(input);
  
  await client.close();

  res.json({ opr: "success" });

}


app.get("/adduser", addUserRecord);

app.get("/findAll",findAll)
app.post("/login-by-post", loginByPost);
app.get('/updateDocument', update);
app.get('/adduserregister',addUserRegist)
app.get("/login", login);
app.get("/booking",booking)
app.listen(4000);
