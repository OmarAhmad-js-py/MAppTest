const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const nodemailer = require("nodemailer");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    console.log(req.body)


    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            })
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "20m" });

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "omar.dreke654@gmail.com",
                pass: "ipbjicnxypylepoj",
            },
            tls: {
                rejectUnauthorized: false
            }
        });




        let info = await transporter.sendMail({
            from: '<omar.dreke654@gmail.com>',
            to: `${email}`,
            subject: "Account Activation",
            text: "Link for account activation",
            html: `${process.env.CLIENT_URL}/email/auth/${token}`
        });


        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        let currentdate = new Date()
        let newdate = `${currentdate.getDate()}-${currentdate.getMonth()}-${currentdate.getFullYear()}`;

        db.query("INSERT INTO users SET ?", { name: name, email: email, password: hashedPassword, Joined: newdate, }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registration: Success, please login before checking your email for the verfication link '
                })

            }
        })

    });


}
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).render('login', {
                message: "Please provide a valid email and password"
            })
        }

        db.query('SELECT *  FROM users WHERE email = ?', [email], async (error, result) => {
            console.log(result);
            if (!(await bcrypt.compare(password, result[0].password)) || !result) {
                res.status(401).render('login', { message: "The email or password is incorrect" })
            } else if (error) {
                console.log("error");
            }
            else {
                const id = result[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRATION
                })

                console.log("The token is:" + token)


                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie("jwt", token, cookieOptions);
                res.status(200).redirect("/profile");
            }
        })

    } catch (error) {
        console.log(error);
    }

}

exports.isLoggedIn = async (req, res, next) => {
    console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            //1) Verify the jwt 
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            console.log(decoded.id)

            //2) cheack if the user still exist

            db.query('SELECT *  FROM users WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result || error)

                if (!result) {
                    return next();
                }

                req.user = result[0];
                return next();
            });

        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }



}

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    })

    res.status(200).redirect('/')
}

// exports.checkVerification = async (req, res, next) => {
//     console.log(req.user.Verfication);
//     if (!req.user.Verfication == "verfied") {
//         try {
//             return res.render('/', {
//                 message: 'Please verify your email address'
//             })
//         } catch (error) {
//             console.log(error);
//             return next();
//         }
//     } else {
//         next();
//     }
// }