//require('dotenv').config(); // allows to use .env

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const axios = require("axios");



const connection = require('./server/config/db');


const app = express(); // creates xpress app
const cookie = require("cookie-parser");
const PORT = 5000 || process.env.PORT;  // for posting online - look into this





//templating engine
app.use(expressLayout);
app.use(cookie());
app.use(express.json());
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));






app.use('/', require('./server/routes/main'));
app.use("/js", express.static(__dirname + "/public/js"))
app.use(express.static(__dirname + '/public'))



connection.connect((err) => {
    if(err) throw err;
    console.log("Database connected")
})

app.use("/api", require("./server/models/auth"));



app.listen(PORT, ()=> {
    console.log(`listening on ${PORT}`);
});

module.exports = app;


