const express = require('express');
const loggedIn = require("../models/loggedin");
const axios = require('axios');
const router = express.Router();
const logout = require("../models/logout");
const connection = require("../config/db");



router.use(express.urlencoded({ extended: false }));

//FACT FUNC
const pokeFacts = [
    "Pokémon Red and Green, the original Pokémon games, were released in Japan on February 27, 1996.",
    "The Pokémon franchise was created by Satoshi Tajiri and Ken Sugimori.",
    "The Pokémon Pikachu Illustrator card is one of the rarest Pokémon cards ever produced, with only 39 copies in existence.",
    "The first Pokémon trading card game (TCG) set was released in Japan in 1996 and internationally in 1999.",
    "The Pokémon TCG has thousands of different cards, including Pokémon, Trainer, and Energy cards.",
    "The most valuable Pokémon card ever sold is a Pikachu Illustrator card, which fetched over $200,000 in a private sale.",
    "The Pokémon Charizard card from the Base Set is one of the most iconic and sought-after cards in the TCG.",
    "The Pokémon Company International hosts an annual World Championships event for the Pokémon TCG.",
    "The Pokémon franchise has expanded beyond video games and trading cards to include an animated TV series, movies, toys, and more.",
    "Pokémon has become one of the highest-grossing media franchises of all time, with billions of dollars in revenue worldwide."
];

function getRandomPokemonFact() {
    const randomIndex = Math.floor(Math.random() * pokeFacts.length);
    return pokeFacts[randomIndex];  
}
//FACT FUNC


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
    const user = req.user;
    const email = req.user.email;
    const randomPokeFact = getRandomPokemonFact();
    if (req.user) {
        res.render('profile', { user: req.user , email, randomPokeFact });
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
});


router.get('/cards', (req, res) => {
    let sortOrder = req.query.sortOrder; // Get the sortt order
    let generation = req.query.generation; // FOR gen sort

    let ep = `http://localhost:4000/pokemon`;
    if (sortOrder) {
        ep += `?sortOrder=${sortOrder}`; // append sort
    } else if (generation) {
        ep += `?generation=${generation}`; // append generation

    }
    

    

    

    axios.get(ep)
        .then((response) => {
            let bdata = response.data;
            res.render('cards', { nametext: 'card', bdata });
        })
        .catch((error) => {
            console.error('Error fetching data from API:', error);
            res.status(500).send('Internal Server Error');
        });
});
router.get('/profile/viewCollection', loggedIn,(req, res) => {
    if (req.user) {
        let userID = req.user.id;
        console.log('User ID:', userID);
        let ep = `http://localhost:4000/pokemon/userCollection?userID=${userID}`; //Passes userId 

        console.log('Sending request to API endpoint:', ep);
        
        axios.get(ep)
        .then((response) => {
            let bdata = response.data;
            console.log('Received data from API:', bdata);
            res.render('cards', { nametext: 'card', bdata, userID });
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
        const status = req.cookies.userRegistered ? "loggedIn" : "loggedOut"; 
        res.render('cardDetails', { data: response.data,status: status });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Handling the admin adding of cards to db
router.post('/pokemon/add', (req, res) => {
    console.log('Received POST request to /add endpoint');

    let name = req.body.nameField;
    let description = req.body.descField;
    let type = req.body.typeField;
    let hp = req.body.hpField;
    let attack = req.body.attackField;
    let defense = req.body.defenseField;
    let price = req.body.priceField;
    let image = req.body.imageField;
    let ability = req.body.abilityField;
    let generation = req.body.genField;


    const insertData = {
        nameField: name,
        descField: description,
        typeField: type,
        hpField: hp,
        attackField: attack,
        defenseField: defense,
        priceField: price,
        imageField: image,
        abilityField: ability,
        genField: generation
    };

    console.log('Data to be inserted:', insertData);

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let endpoint = "http://localhost:4000/pokemon/add";
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


//Users adding to collection
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

            res.redirect('/profile/viewCollection');
        })
        .catch((err) => {
            console.log('Error occurred:', err.message);
            
            res.status(500).send('Internal Server Error');
        });

    } else {
        res.redirect('/login'); // Redirect to login page 
    }

    
    
});




//BLOG
router.post('/profile/newBlogPost', loggedIn, (req, res) => {
    if (req.user) {
        let userId = req.user.id;
        let title = req.body.title;
        let content = req.body.content;

        console.log("User ID:", userId);
        console.log("Title:", title);
        console.log("Content:", content);

        const insertData = {
            userID: userId,
            title: title,
            content: content
        };
        console.log('Data to be inserted:', insertData);

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let endpoint = "http://localhost:4000/pokemon/newBlogPost";

        axios.post(endpoint, insertData, config)
            .then((response) => {
                let insertedid = response.data.respObj.id;
                let resmessage = response.data.respObj.message;
                console.log('Response received:', response.data);
                console.log(`${resmessage}${insertedid}`);
                res.redirect('/profile'); // Redirect to /profile
            })

            .catch((err) => {
                console.log('Error occurred:', err.message);
                res.status(500).send('Internal Server Error');
            });
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
});

router.get('/profile/blogPosts', loggedIn, (req, res) => {
    if (req.user) {
        let userID = req.user.id;
        console.log('User ID:', userID);
        let ep = `http://localhost:4000/profile/blogPosts?userID=${userID}`;

        axios.get(ep)
            .then((response) => {
                let bdata = response.data;
                console.log('Received data from API:', bdata);
                res.render('myBlogs', { nametext: 'card', bdata, user: req.user });
            })
            .catch((error) => {
                console.error('Error fetching data from API:', error);
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

//Handling the deleting from the users colelction
router.post('/profile/removeFromCollection', loggedIn, (req, res) => {
    if (req.user) {
        let getID = req.body.selectedCard;
        let userId = req.user.id;
        
        console.log('Name received from query parameter:', getID);
        const deleteData = {
            cardID: getID,
            userID: userId
            
        };
        console.log('Data to be Deleted:', deleteData);

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let endpoint = "http://localhost:4000/pokemon/removeFromCollection";

        console.log('Making POST request to endpoint:', endpoint);
        axios.post(endpoint, deleteData, config)
        .then((response) => {
            if (response.data.success) {
                //deletion was successful,redirect
                res.redirect('/profile/viewCollection');
            } else {
                // If there was an error i
                console.error('Deletion failed:', response.data.message);
                res.status(500).send('Deletion failed');
            }
        })
        .catch((err) => {
            console.error('Error occurred:', err.message);
            res.status(500).send('Internal Server Error');
        });
        } else {
            res.redirect('/login'); // Redirect to login page if not logged in
        }

    
    
});

router.get('/profile/removeFromcollection', loggedIn, (req, res) => {

    if (req.user) {
        let userID = req.user.id;
        let ep = `http://localhost:4000/pokemon/userCollection?userID=${userID}`;

        axios.get(ep).then((response) => {
            let bdata =response.data;
            res.render('removeFromCollection', {nametext : 'card', bdata, user: req.user}); //
            

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