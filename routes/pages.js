const express = require("express");
const authController = require("../controllers/auth");
const mysql = require("mysql");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { json } = require("body-parser");
const { response } = require("express");
const diff = require("fast-array-diff");
const removeValue = require("remove-value");
const { query } = require("express-validator");
const axios = require("axios");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("index", {
    user: req.user,
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

router.post("/Recommended", authController.isLoggedIn, async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  console.log("The id is");
  console.log(req.body);
  const RecommendedlistID = [];
  RecommendedlistID.push(JSON.stringify(req.body));

  db.query(
    "UPDATE users SET Recommended = ? WHERE id = ? ",
    [RecommendedlistID, decoded.id],
    (err, result) => {
      if (err) {
        res.redirect(authController.logout, "/Login");
      } else {
        res.status(500).send(err);
        console.log(err);
      }
    }
  );
});

router.get("/chosen", (req, res) => {
  console.log(req.body);
  console.log(JSON.parse(req.body));
  res.send(JSON.parse(req.body));
});

router.post("/delRW", authController.isLoggedIn, async (req, res) => {
  if (req.user) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const watchlistid = JSON.parse(req.user.Watchlist);
    const delTMD = JSON.parse(`["${req.body}"]`);

    db.query(
      "SELECT Watchlist FROM users WHERE id = ? ",
      [decoded.id],
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const teditem = diff.same(watchlistid, delTMD);
          const deleteditem = `'[${teditem}]'`.replace(/[\[\]']+/g, "");
          // console.log(deleteditem)

          const Changewatchlist = removeValue(watchlistid, deleteditem);
          const newwatchlist = [];
          newwatchlist.push(JSON.stringify(Changewatchlist));
          console.log(newwatchlist);
          db.query(
            "UPDATE users SET Watchlist = ? WHERE id = ? ",
            [newwatchlist, decoded.id],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log(result);
                res.status(500);
              }
            }
          );
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

router.post("/delRecommended", authController.isLoggedIn, async (req, res) => {
  if (req.user) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const RecommendedlistID = JSON.parse(req.user.Recommended);
    const delTMD = JSON.parse(`["${req.body}"]`);

    db.query(
      "SELECT Recommended FROM users WHERE id = ? ",
      [decoded.id],
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const teditem = diff.same(RecommendedlistID, delTMD);
          const deleteditem = `'[${teditem}]'`.replace(/[\[\]']+/g, "");
          console.log(deleteditem);

          const ChangedelRecommended = removeValue(
            RecommendedlistID,
            deleteditem
          );
          const newdelRecommended = [];
          newdelRecommended.push(JSON.stringify(ChangedelRecommended));
          console.log(newdelRecommended);
          db.query(
            "UPDATE users SET Recommended = ? WHERE id = ? ",
            [newdelRecommended, decoded.id],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log(result);
                res.status(500);
              }
            }
          );
        }
      }
    );
  }
});

router.post("/send", authController.isLoggedIn, async (req, res) => {
  console.log("POST... ");
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  console.log(decoded.id);
  let profileImg;
  let uploadPath;
  console.log(req.files.file.data);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  profileImg = req.files.file.data;
  console.log(profileImg);

  db.query(
    "UPDATE users SET profile_img = ? WHERE id = ? ",
    [profileImg, decoded.id],
    (err, rows) => {
      console.log(rows);

      if (!err) {
        res.redirect("/profile");
      } else {
        res.status(500).send(err);
        console.log(err);
      }
    }
  );
});

//make a route to get blob file from the mysql database
router.get("/getBlob", async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  db.query(
    "SELECT profile_img FROM users WHERE id = ? ",
    [decoded.id],
    async (err, rows) => {
      if (!err) {
        const img = rows[0].profile_img;
        let buffer = Buffer.from(await img);

        res.send("data:png" + ";base64," + buffer.toString("base64"));
      } else {
        res.status(500).send(err);
        console.log(err);
      }
    }
  );
});

router.get(
  "/movies",
  [authController.isLoggedIn, authController.checkVerification],
  (req, res) => {
    if (req.user) {
      res.render("movies", {
        user: req.user,
      });
    } else {
      res.redirect("/login");
    }
  }
);

router.get("/tvshow", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("tvshow", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/singletvshow", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("singletvshow", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get(
  "/singlemovie",
  [
    authController.isLoggedIn,
    query("id").not().isEmpty().withMessage("id is required"),
  ],
  (req, res) => {
    console.log(req.query.id);
    if (req.user) {
      res.render("singlemovie.hbs", {
        user: req.user,
      });
    } else {
      res.redirect("/login");
    }
  }
);

router.post("/watchlistAPI", authController.isLoggedIn, async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const WatchlistID = [];
  WatchlistID.push(JSON.stringify(req.body));
  console.log(WatchlistID);

  db.query(
    "UPDATE users SET Watchlist = ? WHERE id = ? ",
    [WatchlistID, decoded.id],
    (err, result) => {
      if (err) {
        res.redirect(authController.logout, "/Login").send(err);
        console.log(err);
      } else {
        console.log(result);
        res.status(500);
      }
    }
  );
});

router.get("/Watchlist", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("Watchlist", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/Wathclater", authController.isLoggedIn, (req, res) => {
  res.json(req.user);
});

router.get("/page", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("page", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get(
  "/email/auth/:token",
  authController.isLoggedIn,
  async (req, res) => {
    if (req.user) {
      const [decoded, decoded_id] = await Promise.all([
        promisify(jwt.verify)(req.params.token, process.env.JWT_SECRET),
        promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET),
      ]);
      if (decoded.email === req.user.email) {
        db.query(
          "UPDATE users SET Verfication = ? WHERE id = ? ",
          ["verifed", decoded_id.id],
          (err, rows) => {
            if (err) {
              console.log(err);
            } else {
              console.log(rows);
            }
          }
        );
        res.redirect("/profile");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  }
);

router.post("/profile", authController.isLoggedIn, (req, res) => {
  res.json(req.user);
});

router.get("/adblocker", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    axios.get("https://easylist.to/easylist/easylist.txt").then((response) => {
      const data = response;
      res.render("adblocker");
      res.status(200).send(data);
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
