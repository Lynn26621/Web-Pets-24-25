const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const crypto = require("crypto");
const { log } = require("console");

//set URLs
const AUTH_URL = "https://formbar.yorktechapps.com/oauth";
const THIS_URL = "http://localhost:3000/login";

//set secret key
const JWT_SECRET = "key_secret";

//create a new database, set as the "db" object
const db = new sqlite3.Database("data/database.db", (err) => {
    if (err) {
        console.error("Failed to connect to the database: ", err);
        process.exit(1); //exit the process
    };
});

/*----------
GET Requests
----------*/

//create root function
const index = (req, res) => {
    if (req.session.user) {
        //user is logged in
        res.render("index", { username: req.session.user });
    } else {
        //user is not logged in
        res.render("index", { username: null });
    };
};

//handle login
const loginGET = (req, res) => {
    //extract token from the Authorization header
    const token = req.query.token;
console.log(token)
    if (!token) {
        res.render("login", { AUTH_URL: AUTH_URL, THIS_URL: THIS_URL });
    } else if (token) {
        let tokenData = jwt.decode(req.query.token);
        req.session.token = tokenData;
        req.session.user = tokenData.username;
        //load pet from database here
        
    
    };
};

//handle logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send("Error destroying session: " + err);
        } else {
            res.redirect("/login");
        };
    });
};

//handle chat
const chat = (req, res) => {
    if (req.session.user) {
        //user is logged in
        res.render("chat", { username: req.session.user });
    } else {
        res.redirect("/login");
    };
};

//handle map
const map = (req, res) => {
    if (req.session.user) {
        //user is logged in
        res.render("map", { username: req.session.user });
    }
    else {
        res.redirect("/login");
    }
};

const store = (req, res) => {
    if (req.session.user) {
        //user is logged in
        res.render("store", { username: req.session.user });
    }
    else {
        res.redirect("/login");
    }
};

const work = (req, res) => {
    if (req.session.user) {
        //user is logged in
        res.render("work", { username: req.session.user });
    }
    else {
        res.redirect("/login");
    }
};


const petGET = (req, res) => {
    if (req.session.user) {
        //user is logged in
        console.log("Pet:", req.session.pet);
        res.render("pet", { username: req.session.user, pet1: req.session.pet });
    } else {
        //user is not logged in
        res.render("pet", { username: null });
    };
};

/*-----------
POST Requests
-----------*/

const loginPOST = (req, res) => {
    //extract token from the Authorization header
    const token = req.query.token;
    const { user, pass } = req.body;

    //login with database
    if (user && pass) {
        db.get("SELECT * FROM users WHERE username=?;", [user], (err, row) => {
            if (err) {
                console.log(err);
                res.send("There was an error:\n" + err);
            } else if (!row) {
                //create a new salt for this user
                const salt = crypto.randomBytes(16).toString("hex");

                //use the salt to "hash" the password
                crypto.pbkdf2(pass, salt, 1000, 64, "sha512", (err, derivedKey) => {
                    if (err) {
                        res.send("Error hashing password: " + err);
                    } else {
                        const hashedPassword = derivedKey.toString("hex");

                        db.run("INSERT INTO users (username, password, salt) VALUES (?, ?, ?);", [user, hashedPassword, salt], (err) => {
                            if (err) {
                                res.send("Database error: \n" + err);
                            } else {
                                res.send("Created new user");
                            };
                        });
                    };
                });
            } else if (row) {
                //compare stored password with provided password
                crypto.pbkdf2(pass, row.salt, 1000, 64, "sha512", (err, derivedKey) => {
                    if (err) {
                        res.send("Error hashing password: " + err);
                    } else {
                        const hashedPassword = derivedKey.toString("hex");

                        if (row.password === hashedPassword) {
                            req.session.user = user;
                            
                            db.get("SELECT pets.*, users.username FROM pets; JOIN users ON pets.ownerID = users.uid;", [req.session.user], (err, row) => {
                                console.log('check 1');
                                
                                if (!row) {
                                    console.log('check 2');
                                    //if no pet, create a new pet, write to database
                                    db.run("INSERT INTO pets (ownerID, hunger, happiness) VALUES (?, 100, 100);", [req.session.user], (err) => {
                                        if (err) {
                                            res.send("Error creating pet: " + err);
                                        } else {
                                            req.session.pet = { username: req.session.user, hunger: 100, happiness: 100 };
                                            console.log('check 3: ' + req.session.pet)
                                            res.redirect("/pet");
                                        };
                                    });
                                }
                                else {
                                    //pet found
                                    req.session.pet = row;
                                    console.log(req.session.pet)
                                    res.redirect("/pet");
                                };
                    
                            });
                        } else {
                            res.status(401).send("Invalid username or password.");
                        };
                    };
                });
            };
        });
    } else if (token) {
        //login with formbar
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token has expired. Please log in again.");
                } else if (err.name === "JsonWebTokenError") {
                    return res.status(400).send("Invalid token.");
                } else {
                    return res.status(500).send("An unknown error occurred.");
                };
            };
            //store username in the session
            req.session.user = decoded.username;
            console.log("Session User:", req.session.user);
            res.redirect("/");
        });
    } else {
        res.send("Please enter both a username and password.");
    };
};

module.exports = {
    index,
    loginGET,
    logout,
    chat,
    petGET,
    loginPOST,
    map,
    store,
    work
};