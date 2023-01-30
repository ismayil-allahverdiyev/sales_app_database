const index = require("../index")
const express = require("express");
const mongoose = require("mongoose")
var Grid = require('gridfs-stream');
const { any } = require("../middlewares/gfsUpload");

const filesRouter = express.Router();

filesRouter.get("/api/files/:filename", (req, res) => {
    try{
        const parFilename = req.params.filename
        console.log(parFilename)
        //
        // const file = index.gfs.find({filename: parFilename}).toArray((err, result) =>{
             
        // });
        // GridFS Collection
        // const file = index.gfs.findOne({filename: parFilename}, (err, video) => {

        const file = index.gfs.find({filename: parFilename}).toArray((err, files) =>{
            if(err){
                res.status(200).send(err);
                return;
            }
            if (!files) {
                res.status(404).send("No video uploaded!");
                return;
            }
            console.log(files[0].length + "");
        

            // Create response headers
            const range = files[0].length;//getting the length of the first found file
            const videoSize = files[0].length;
            const start = 0;
            //            const start = Number(range.replace(/\D/g, ""));
            const end = videoSize - 1;

            const contentLength = end - start + 1;
            console.log(videoSize+" videoSize"+start+" start")
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };
            console.log(" 1 ")
            // HTTP Status 206 for Partial Content
            res.writeHead(206, headers);
            console.log(" 2 ")
            console.log(" 3 ")
            const downloadStream = index.gfs.openDownloadStreamByName(parFilename, {
                start
            });
            console.log(downloadStream)
            console.log(" 4 ")
            // Finally pipe video to response
            downloadStream.pipe(res);
            console.log(" 5 ")
        });
        // const file = index.gfs.find({filename: parFilename}).toArray((err, result) =>{
        //     if(err){
        //         res.status(400).send({err})
        //     }else{
        //         console.log("result is " + result)
        //         if(!result || result.length == 0){
        //             res.status(201).send({"message" : "File does not exist!"})
        //         }else{
        //             index.gfs.openDownloadStreamByName(parFilename).pipe(res)
        //         }
        //     }
        // });
        
    }catch(e){
        console.log(e)
        res.send(e)
    }
})
module.exports = filesRouter
