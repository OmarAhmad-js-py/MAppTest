const express = require('express');
const authController = require('../controllers/auth')
const mysql = require('mysql');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { json } = require('body-parser');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const showid = authController.login
console.log(showid.id);

router.get("/", authController.isLoggedIn, (req, res) => {
    res.render("index", {
        user: req.user
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/profile", authController.isLoggedIn, (req, res) => {

    if (req.user) {
        res.render("profile", {
            user: req.user,

        });
    } else {
        res.redirect("/login");
    }


});


router.post("/send", authController.isLoggedIn, async (req, res) => {

    console.log("POST... ");
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    console.log(decoded.id)
    let profileImg;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }


    profileImg = req.files.profileImg;
    uploadPath = './upload/' + profileImg.name;
    console.log(profileImg);

    profileImg.mv(uploadPath, function (err) {
        if (err) {
            return

        }

        db.query("UPDATE users SET profile_img = ? WHERE id = ? ", [profileImg.name, decoded.id], (err, rows) => {
            console.log(rows);

            if (!err) {
                res.redirect("/profile");
            } else {
                res.status(500).send(err);
                console.log(err);
            }
        });


    });

});

router.get("/movies", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("movies", {
            user: req.user

        })
    } else {
        res.redirect("/login");
    }
}
)

router.get("/tvshow", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("tvshow", {
            user: req.user

        })
    } else {
        res.redirect("/login");
    }
})


router.get("/singletvshow", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("singletvshow", {
            user: req.user

        })
    } else {
        res.redirect("/login");
    }
})




router.post("/watchlistAPI", authController.isLoggedIn, (req, res) => {

    console.log("The id is")
    console.log(res.body);
    res.send(res.json());
})




module.exports = router;
