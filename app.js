const express = require('express');
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

dotenv.config();
console.log(process.env.API_KEY)
const app = express();


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public')
const privateDirectory = path.join(__dirname, './private')
app.use(express.static(publicDirectory));
app.use(express.static(privateDirectory));
app.use(express.static('upload'))
app.use(fileUpload())
// Parse URL_encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// require json.decode
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser());
app.set("view engine", "hbs");

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...");
    }
})

//Define Routes
app.use("/", require("./routes/pages"));
app.use('/auth', require("./routes/auth"))

app.listen(5001, () => {
    console.log("Server started on port 5001")
})