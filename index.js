
const PORT = 3000;
const DB = "mongodb+srv://isi:1124816%40isi2003@clusteraisha.fgl4fve.mongodb.net/test";

const express = require("express");
const mongoose = require("mongoose");
var Grid = require('gridfs-stream');
const uploadGfs = require("./middlewares/gfsUpload")
const authRouter = require("./routes/auth.js");
const posterRouter = require("./routes/poster.js");

const filesRouter = require("./routes/files");

const app = express();

// let gfs;
let db;

const connectDatabase = async () => {
    try {      
      await mongoose.connect(DB);
  
      console.log("connected to database");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
connectDatabase();

mongoose.connection.on('connected', () => {
    module.exports.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection, {
      bucketName: "uploads"
    })
})

app.use(express.json());
app.use(authRouter);
app.use(filesRouter);
app.use(posterRouter);

app.get("/hi", (req, res) => {
    console.log("SSS");
    res.send("aaa")
})

app.listen(PORT, "192.168.71.26", function (){
    console.log(`Connected to ${PORT}`);
});

// module.exports = {gfs}