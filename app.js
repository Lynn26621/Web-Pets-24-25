//to install required modules in the terminal: type "npm i express express-session ejs jsonwebtoken sqlite3 connect-sqlite3 socket.io path"

//import external modules
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session); //create the "SQLiteStore" object from session
const socketIO = require("socket.io");
const path = require("path");

//import custom modules
const routesMod = require("./modules/routes.js")
const socketMod = require("./modules/socket.js")

/*-----------
Server Config
-----------*/

const app = express(); //initialize express, set as the "app" object
const port = process.env.PORT || 3000; //set the port number

//initialize the server, set as the "server" object
const server = app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
});

const io = socketIO(server); //create the "io" object from the server

//initiaize session, set as the "session_MIDDLEWARE" object
const session_MIDDLEWARE = session({
    store: new SQLiteStore,
    secret: "key_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

//create isAuthenticated function
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) next();
    else res.redirect("/login");
};

app.set("view engine", "ejs"); //set ejs as the view engine
app.use(session_MIDDLEWARE); //configure the server to use middleware
app.use(express.urlencoded({ extended: true })); //encode url

//configure the server to use routes from routes.js
app.get("/", routesMod.index);
app.get("/login", routesMod.loginGET);
app.get("/logout", isAuthenticated, routesMod.logout);
app.get("/chat", isAuthenticated, routesMod.chat);
app.get("/pet", isAuthenticated, routesMod.petGET);
app.get("/map", isAuthenticated, routesMod.map);
app.get("/work", isAuthenticated, routesMod.work);
app.get("/store", isAuthenticated, routesMod.store);
app.post("/login", routesMod.loginPOST);

app.use(express.static(path.join(__dirname, "public"))); //configure use the static "public" folder for requests

//configure the io object to use middleware
io.use((socket, next) => {
    session_MIDDLEWARE(socket.request, {}, next);
});

//configure the io object to use connect from socket.js
io.on("connection", (socket) => {
    socketMod.socketHandler(socket, io);
});

app.get('/pet', (req, res) => {
    res.render('pet', { pet1: pet1 });
}
);

function petHunger(pet) {
    console.log("hunger function");

    let timer = setInterval(() => {
        pet.hunger -= 1;
        if (pet.hunger <= 0) {
            clearInterval(timer);
        }
    }, 10000); //10 seconds

    return pet.hunger;
}

app.get('/pet', (req, res) => {
    res.render('pet', { pet1: pet1, petHunger: petHunger.toString() });
});

// app.post('/feed', (req, res) => {
//     pet1 = petFeed(pet1);
//     res.send(`Hunger: ${pet1.hunger}, Happiness: ${pet1.happiness}`);
// });

// app.post('/play', (req, res) => {
//     pet1 = petPlay(pet1);
//     res.send(`Hunger: ${pet1.hunger}, Happiness: ${pet1.happiness}`);
// });