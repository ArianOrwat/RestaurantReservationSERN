const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/admin/addtable
// @desc    Add table
// @access  Private Admin

router.post('/addtable', auth, admin, (req, res) => {
    
    const { people, window } = req.body;

    try {

        const table = {
            people,
            window
        }

        db.query('INSERT INTO tables SET ?', table, (err) => {
            if(err) {console.log(err); res.code(500),json('Server error')}
            else res.status(201).json( { msg: 'Table created!' } );
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

// @route   DELETE api/admin/deletetable
// @desc    Delete table
// @access  Private Admin

router.delete('/deletetable/:id', auth, admin, (req, res) => {

    const { id } = req.params;

    db.query(`DELETE FROM tables WHERE id = ${id}`, (err) => {
        if(err) {console.log(err); res.status(500).json('Server error')}
        else res.status(200).json({ msg: 'Table deleted!' });
    })

});

// @route   Get api/admin/reservation
// @desc    Get all reservation
// @access  Private Admin

router.get("/reservation", auth, admin, (req, res) => {
    
    db.query('SELECT r.id, r.time, r.day, u.email, t.id AS table_id, t.people, t.window FROM reservation r JOIN tables t ON t.id = r.table_id JOIN users u ON u.id = r.user_id', (err, result) => {
        if(err) {console.log(err); res.status(500).json('Server error')}
        res.status(200).json(result);
    })
});

module.exports = router;