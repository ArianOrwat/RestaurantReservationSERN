const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/admin/addtable/:people/:window
// @desc    Add table
// @access  Private

router.post('/addtable/:people/:window', auth, admin, (req, res) => {
    
    const { people, window } = req.params;

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
// @desc    Add table
// @access  Private

router.delete('/deletetable/:id', auth, admin, (req, res) => {

    const { id } = req.params;

    db.query(`DELETE FROM tables WHERE id = ${id}`, (err) => {
        if(err) {console.log(err); res.code(500).json('Server error')}
        else res.status(200).json({ msg: 'Table deleted!' });
    })

});

module.exports = router;