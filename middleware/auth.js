const jwt  = require("jsonwebtoken");
const db  = require('../config/db');
const config =  require("config");

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if(!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        db.query(`SELECT created FROM users WHERE id = ${decoded.user.id}`, (err, result) => {
            if((Date.parse(result[0].created))/1000 > decoded.iat) {
                res.status(401).json({ msg: 'Token is not valid' });
            }
            req.user = decoded.user;
            next();
        });
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }

}