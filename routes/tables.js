const express = require("express");
const router = express.Router();
const db = require("../config/db");
const config = require("config");

// @route   GET api/tables
// @desc    Get tables
// @access  Public

router.get('/:day/:month/:year/:people', (req, res) => {
    const { day, month, year, people } = req.params;
    
    try {
        db.query(`SELECT * FROM tables t JOIN reservation r ON r.table_id = t.id WHERE t.people = ${people}`, (err, result) => {
            if(err) {console.log(err); res.code(500).json('Server error')}
            else {

                let hours = [];
                const businessHours = config.get("businessHours");
                const dayVarible = new Date(year, month, day)
                const dayOfWeek = dayVarible.getDay();

                const x = businessHours[dayOfWeek];
                if(x.length !== 0) {
                    const time = (x[1] - x[0])*2;

                    for(let i = 0; i<time; i++) {
                        hours[i] = (x[0] + 0.5*i);
                        Math.round(hours[i]) === hours[i] 
                        ?
                        hours[i] = `${hours[i]}:00:00`
                        :
                        hours[i] = `${(Math.round(hours[i]) - 1)}:30:00`;
                    }

                } else hours.push("Closed");

                console.log(hours);

                if(result.length === 0) {

                }

            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;