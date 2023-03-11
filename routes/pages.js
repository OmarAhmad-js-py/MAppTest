const express = require("express");
const authController = require("../controllers/auth");
const { Pool } = require('pg')
const router = express.Router();
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { json } = require("body-parser");
const { response } = require("express");
const diff = require("fast-array-diff");
const removeValue = require("remove-value");
const { query } = require("express-validator");
const axios = require("axios");

const db = new Pool({
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.PORT,
  host: process.env.HOST,
})

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

//The POST request handler for the /Recommended route takes in the user's ID and an array of recommended movie IDs in the request body. 
//It first verifies the user's JSON web token using the jwt.verify() method and then retrieves the user's ID from the decoded token.
//It then creates an empty array RecommendedlistID and pushes the recommended movie IDs received in the request body to this array. 
//Finally, it updates the Recommended field in the user's database record with this array of recommended movie IDs.
router.post("/Recommended", authController.isLoggedIn, async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  console.log("The id's is  " + req.body);
  const RecommendedlistID = [];
  RecommendedlistID.push(req.body);
  const Selectquery = "SELECT Recommended FROM users WHERE id = $1"
  try {
    db.query(Selectquery, [decoded.id], (err, result) => {
      if (err) throw err;
      const recommended = result.rows[0].recommended
      let Newrecommended = []
      if (recommended !== null) {
        console.log("There are recommended movies")
        Newrecommended = RecommendedlistID
      }
      else {
        console.log("No recommended movies")
        Newrecommended = RecommendedlistID
      }
      console.log(Newrecommended)
      db.query(
        "UPDATE users SET Recommended = $1 WHERE id = $2 ",
        [Newrecommended, decoded.id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.redirect(authController.logout, "/Login");
          } else {
            res.status(500).send(err);
          }
        }
      )
    }
    );
  } catch (error) {
    console.log(error);
  }

});

//The POST request handler for the /watchlistAPI route accepts the imdb_id of a movie in the request body and adds it to the user's watchlist.
//It first verifies the user's JSON web token using the jwt.verify() method and retrieves the user's ID from the decoded token.
//It then creates an empty array WatchlistID and pushes the imdb_id received in the request body to this array. 
//The route then executes a SELECT query on the user's database record to retrieve their existing watchlist. 
//If the user already has a watchlist, the watchlist is concatenated with the new WatchlistID, and the resulting array has all null values filtered out. 
//If the user does not already have a watchlist, WatchlistID is used as the new watchlist. 
//Finally, the user's database record is updated with the new watchlist using an UPDATE query. 
//If there are any errors during the execution of this route handler, an error response is sent with a status of 500.
router.post("/watchlistAPI", authController.isLoggedIn, async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const WatchlistID = [];
  console.log(req);
  WatchlistID.push(req.body.imdb_id);
  console.log("The id's is" + WatchlistID)
  const Selectquery = "SELECT watchlist FROM users WHERE id = $1"
  try {
    db.query(Selectquery, [decoded.id], async (err, result) => {
      if (err) throw err;
      console.log(result.rows[0].watchlist)
      const watchlist = result.rows[0].watchlist
      let Newwatchlist = []
      if (watchlist !== null) {
        Newwatchlist = watchlist.concat(WatchlistID)
        Newwatchlist = Newwatchlist.filter((el) => {
          return el != null;
        });
      }
      else {
        Newwatchlist = WatchlistID
        // remove all null values from the array
        Newwatchlist = Newwatchlist.filter((el) => {
          return el != null;
        });
      }

      db.query(
        "UPDATE users SET Watchlist = $1 WHERE id = $2 ",
        [Newwatchlist, decoded.id],
        (err, result, rows) => {
          if (err) {
            res.redirect(authController.logout, "/Login").send(err);
            console.log(err);
          } else {
            console.log("Watchlist Updated");
            res.status(500);
          }
        }
      );


    });
  } catch (error) {
    console.log(error)
  }

});


router.get("/chosen", (req, res) => {
  console.log(req.body);
  console.log(JSON.parse(req.body));
  res.send(JSON.parse(req.body));
});

//queries the database to retrieve the user's current watchlist. 
//The ID of the item to be deleted is parsed from the request body and checked against
// the watchlist to ensure that the item exists in the list.
//If the item is found in the list, it is removed from the array using the splice method.The updated watchlist is then saved to the database for the user.
//If any errors occur during the process, they are logged to the console and a 500 status code is returned to the client.
router.post("/delRW", authController.isLoggedIn, async (req, res) => {
  if (req.user) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const watchlistUID = req.user.watchlist
    console.log(watchlistUID);
    const delTMD = JSON.parse(`["${req.body}"]`);
    console.log(delTMD);
    db.query(
      "SELECT Watchlist FROM users WHERE id = $1 ",
      [decoded.id],
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          //check if the id is already in the watchlist
          const teditem = diff.same(watchlistUID, delTMD);
          // remove the brackets and quotes from the id
          const deleteditem = `'[${teditem}]'`.replace(/[\[\]']+/g, "");
          // find the index(position in a array) of the id in the array
          const index = watchlistUID.indexOf(deleteditem);
          console.log(index)
          console.log(watchlistUID + "before splice")
          // remove duplicate id's from the array
          if (index !== -1) {
            watchlistUID.splice(index, 1);
          }
          console.log(watchlistUID + "after splice");
          db.query(
            "UPDATE users SET Watchlist = $1 WHERE id = $2 ",
            [watchlistUID, decoded.id],
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

// router.post("/delRecommended", authController.isLoggedIn, async (req, res) => {
//   if (req.user) {
//     const decoded = await promisify(jwt.verify)(
//       req.cookies.jwt,
//       process.env.JWT_SECRET
//     );
//     console.log(req.user.recommended[0])
//     console.log(' is recommended');
//     const RecommendedlistID = req.user.recommended;
//     const delTMD = JSON.parse(`["${req.body}"]`);
//     console.log(delTMD);
//     db.query(
//       "SELECT Recommended FROM users WHERE id = $1 ",
//       [decoded.id],
//       async (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           const teditem = diff.same(RecommendedlistID, delTMD);
//           const deleteditem = `'[${teditem}]'`.replace(/[\[\]']+/g, "");
//           console.log(deleteditem);
//           const index = RecommendedlistID.indexOf(deleteditem);
//           console.log(index)
//           console.log(RecommendedlistID)
//           if (index !== -1) {
//             RecommendedlistID.splice(index, 1);
//           }
//           console.log(RecommendedlistID);
//           db.query(
//             "UPDATE users SET Recommended = $1 WHERE id = $2 ",
//             [RecommendedlistID, decoded.id],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 console.log(result);
//                 res.status(500);
//               }
//             }
//           );
//         }
//       }
//     );
//   }
// });

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
    "UPDATE users SET profile_img = $1 WHERE id = $2 ",
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

router.get("/getBlob", async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  db.query(
    "SELECT profile_img FROM users WHERE id = $1 ",
    [decoded.id],
    async (err, rows) => {
      rows = rows.rows
      if (!err) {
        const img = rows[0].profile_img;
        let buffer = await img;
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


router.get("/Watchlist", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("Watchlist", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/Watchlater", authController.isLoggedIn, (req, res) => {
  console.log(req.get("host"))
  const path = req.route.pathb
  if (path === '/Watchlater') {
    return res.json(req.user.watchlist)
  }
  res.json(req.user.recommended)
});

// router.get("/page", authController.isLoggedIn, (req, res) => {
//   if (req.user) {
//     res.render("page", {
//       user: req.user,
//     });
//   } else {
//     res.redirect("/login");
//   }
// });

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
          "UPDATE users SET Verfication = $1 WHERE id =$2 ",
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
