const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    try {
        res.render("main");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/resize", (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded.");
        }

        const width = req.body.width;
        const height = req.body.height;

        const uploadedFile = req.files.file;
        const uploadPath = path.join(__dirname, "Uploads", uploadedFile.name);
        const resultsPath = path.join(__dirname, "Results", uploadedFile.name);

        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return console.log(err.message);
            }
            
            sharp(uploadPath).resize(parseInt(width), parseInt(height)).toFile(resultsPath, (err) => {
                if (err) {
                    return console.log(err.message);
                }
                res.download(resultsPath);

                fs.unlink(uploadPath, (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    fs.unlink(resultsPath, (err) => {
                        if (err) {
                            return console.log(err.message);
                        }
                    });
                });
            });
        });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log("Express server is listening to " + port);
});