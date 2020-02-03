const db  = require('../config/db');

module.exports = function(req, res, next) {
    const user = req.user;

    db.query(`SELECT * FROM users u JOIN role r ON u.role_id = r.id WHERE u.id = ${user.id}`, (err, result) => {
        if(err) {console.log(err); res.code(500),json('Server error')};
        if(result[0].role === 'admin') {
            next();
        } else {
            res.status(403).json({ msg: 'You don\'t have permission' });
        }
    });
}