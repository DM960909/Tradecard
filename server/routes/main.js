const express = require('express');
const loggedIn = require("../models/loggedin");
const axios = require('axios');
const router = express.Router();
const logout = require("../models/logout");








// Home route
router.get("/", loggedIn, (req, res) => { 
    if(req.user) {
        res.render("index", {status: "loggedIn", user:req.user});
    } else {
        res.render("index", {status:"no", user: "nothing"});
    }
});

// Other routes
router.get("/register", (req,res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});


router.get('/contact', (req, res) => {
    res.render("contact");
});

router.get('/premium', (req,res) => {
    res.render("premium");
});

router.get('/FAQ', (req,res) => {
    res.render("FAQ");
});

router.get('/profile', loggedIn, (req, res) => {
    if (req.user) {
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
});

router.get('/cards', (req, res) => {
    let ep = `http://localhost:4000/pokemon/`;

    axios.get(ep).then((response) => {
        let bdata =response.data;
        res.render('cards', {nametext : 'card', bdata});
        

    });
    
});

router.get('/cardDetails', async (req, res) => {
    let r_id = req.query.card;
    let endp = `http://localhost:4000/pokemon/${r_id}`;

    try {
        const response = await axios.get(endp);
        res.render('cardDetails', { data: response.data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/logout", logout);




module.exports = router;