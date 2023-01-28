const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");

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
        var width = req.body.width;
        var height = req.body.height;

        var uploadedFile = req.files.file;
        var uploadPath = path.join(__dirname, "Uploads", uploadedFile.name);
        var resultsPath = path.join(__dirname, "Results", uploadedFile.name);
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return console.log(err.message);
            }

            sharp(uploadPath).metadata().resize(parseInt(width), parseInt(height)).toFile(resultsPath).then((err, data) => {
                if (err) {
                    return console.log(err.message);
                }

                console.log("Width: " + data.width);
                console.log("Height: " + data.height);
            });

            res.redirect("/");
        });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log("Express server is listening to " + port);
});