const db = require("../config/db");
const jwt = require("jsonwebtoken");

const loggedIn = (req, res, next) => {
    // Check if the user is logged in
    if (req.cookies.userRegistered) {
        try {
            // Verify the JWT token in enva
            const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
            
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, result) => {
                if (err) {
                    
                    return next();
                }
               
                req.user = result[0];
               
                return next();
            });
        } catch (err) {
            
            return next();
        }
    } else {
        // If the user is not logged in
        return next();
    }
};

module.exports = loggedIn;
