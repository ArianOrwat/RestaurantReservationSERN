const express = require("express");
const router = express.Router();
const db = require("../config/db");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// @route   GET api/tables/:day/:month/:year/:people
// @desc    Get tables
// @access  Public

router.get("/:day/:month/:year/:people", (req, res) => {
  const { day, month, year, people } = req.params;

  if (Date.parse(new Date(year, month, day)) < Date.now()) {
    res.status(400).json({ msg: "Date error" });
  }

  try {
    db.query(
      `SELECT * FROM tables t JOIN reservation r ON r.table_id = t.id WHERE t.people = ${people}`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.code(500).json("Server error");
        } else {
          let hours = [];
          const businessHours = config.get("businessHours");
          const dayVarible = new Date(year, month, day);
          const dayOfWeek = dayVarible.getDay();

          const x = businessHours[dayOfWeek];
          if (x.length !== 0) {
            const time = (x[1] - x[0]) * 2;

            for (let i = 0; i < time; i++) {
              hours[i] = x[0] + 0.5 * i;
              Math.round(hours[i]) === hours[i]
                ? (hours[i] = `${hours[i]}:00:00`)
                : (hours[i] = `${Math.round(hours[i]) - 1}:30:00`);
            }
          } else hours.push("Closed");

          if (result.length === 0) {
            res.status(200).json({ hours });
          } else {
            const timeMap = result.map(resultt => resultt.time);
            const end = hours.filter(hour => timeMap.indexOf(hour) == -1);
            res.status(200).json({ hours: end });
          }
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/tables
// @desc    Reserve table
// @access  Private

router.post("/", auth, (req, res) => {
  const { date, people, window } = req.body;

  try {
    const table = {
      date,
      people,
      window
    };

    db.query("INSERT INTO users SET ?", table, err => {
      if (err) {
        console.log(err);
        res.status(500).send("Server error");
      } else res.status(201).json({ msg: "Table reserved" });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { user } = req;

  db.query(
    `SELECT * FROM reservation r JOIN users u ON r.user_id = u.id WHERE r.id = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server error");
      } else {
        if (result[0].id === user.id) {
          db.query(`DELETE FROM reservation WHERE id = id`, err => {
            if (err) {
                console.log(err);
                res.status(500).send("Server error");
              } else res.status(200).json( { msg: "Reservation deleted" } )
        });
        } else {
            res.status(403).json({ msg: 'You don\'t have permission' });
        }
      }
    }
  );
});

module.exports = router;
