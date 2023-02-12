const express = require('express');
const { Pool } = require('pg')
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

dotenv.config();
console.log(process.env.API_KEY)
const app = express();

console.log(process.env.API_KEY)

const client = new Pool({
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.PORT,
    host: process.env.HOST,
})


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

client.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("client Connected...");
    }
})




//Define Routes
app.use("/", require("./routes/pages"));
app.use('/auth', require("./routes/auth"))
const port = 5001 || process.env.PORT;

app.listen(port, () => {
    console.log("Server started on port " + port)
})
