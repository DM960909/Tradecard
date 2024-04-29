const express = require('express');
const loggedIn = require("../models/loggedin");
const axios = require('axios');
const router = express.Router();
const logout = require("../models/logout");
const connection = require("../config/db");

router.use(express.urlencoded({ extended: false }));




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

router.get('/profile/viewCollection', loggedIn,(req, res) => {
    if (req.user) {
        let userID = req.user.id;
        console.log('User ID:', userID);
        let ep = `http://localhost:4000/pokemon/userCollection?userID=${userID}`;

        console.log('Sending request to API endpoint:', ep);
        
        axios.get(ep)
        .then((response) => {
            let bdata = response.data;
            console.log('Received data from API:', bdata);
            res.render('viewCollection', { nametext: 'card', bdata, userID });
        })
        .catch((error) => {
            console.error('Error fetching data from API:', error);
            res.status(500).send('Internal Server Error');
        });
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
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
router.post('/add', (req, res) => {
    let name = req.body.name; // Access query parameter
    console.log('Name received from query parameter:', name);

    const insertData = {
        nameField: name
    };
    console.log('Data to be inserted:', insertData);

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let endpoint = "http://localhost:4000/pokemon/add";

    // Move the Axios POST request inside the callback function of res.send()
    console.log('Making POST request to endpoint:', endpoint);
    axios.post(endpoint, insertData, config)
        .then((response) => {
            let insertedid = response.data.respObj.id;
            let resmessage = response.data.respObj.message;
            console.log('Response received:', response.data);

            res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
        })
        .catch((err) => {
            console.log('Error occurred:', err.message);
            // Handle errors
            res.status(500).send('Internal Server Error');
        });
});


router.post('/profile/addToCollection', loggedIn, (req, res) => {
    if (req.user) {
        let getID = req.body.selectedCard;
        let userId = req.user.id;
        
        console.log('Name received from query parameter:', getID);
        const insertData = {
            cardID: getID,
            userID: userId
            
        };
        console.log('Data to be inserted:', insertData);

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let endpoint = "http://localhost:4000/pokemon/addToCollection";

        console.log('Making POST request to endpoint:', endpoint);
        axios.post(endpoint, insertData, config)
            .then((response) => {
                let insertedid = response.data.respObj.id;
                let resmessage = response.data.respObj.message;
                console.log('Response received:', response.data);

            res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
        })
        .catch((err) => {
            console.log('Error occurred:', err.message);
            // Handle errors
            res.status(500).send('Internal Server Error');
        });

    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }

    
});

router.get('/profile/addTocollection', loggedIn, (req, res) => {

    if (req.user) {
        
        let ep = `http://localhost:4000/pokemon/`;

        axios.get(ep).then((response) => {
            let bdata =response.data;
            res.render('addCollection', {nametext : 'card', bdata, user: req.user}); //checking if user is loggedIn 
            

        });
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
    
    
});


router.get('/add', (req, res)=> { 
    res.render('add');
});



router.get("/logout", logout);




module.exports = router;