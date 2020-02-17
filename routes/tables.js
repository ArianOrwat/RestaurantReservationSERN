const express = require("express");
const router = express.Router();
const db = require("../config/db");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// @route   GET api/tables/people
// @desc    Get places at the table
// @access  Public

router.get("/people", (req, res) => {
  db.query("SELECT DISTINCT people FROM tables", (err, results) => {
    if (err) {
      console.log(err);
      res.code(500).json("Server error");
    } else {
      let people = [];
      results.map(result => people.push(result.people));
      res.status(200).json(people);
    }
  });
});

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
      `SELECT * FROM tables t WHERE t.people = ${people}`,
      async (err, results) => {
        let end = [];
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
          if (results.length === 0) {
            res.status(400).json({ msg: "Table not found" });
            // FIX
          } else {
            let resultEnd = [];
            results.forEach((result, idx) => {
              db.query(
                `SELECT time FROM reservation WHERE table_id = ${result.id} AND day = '${year}-${month}-${day}'`,
                (err, secondResults) => {
                  if (err) {
                    console.log(err);
                    res.status(500).send("Server error");
                  } else {
                    if (secondResults.length === 0) {
                      result.hours = hours;
                      resultEnd.push(result);
                    } else {
                      const timeMap = secondResults.map(
                        secondResult => secondResult.time
                      );
                      result.hours = hours.filter(
                        hour => timeMap.indexOf(hour) == -1
                      );
                      resultEnd.push(result);
                    }
                    if (idx === results.length - 1) {
                      res.status(200).json({ resultEnd });
                    }
                  }
                }
              );
            });
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
  const { minutes, hours, day, month, year, table_id } = req.body;
  const user = req.user;

  const date = new Date(year, month, day, (hours*1+1), minutes, 0, 0);
  console.log(date);
  try {
    const table = {
      day: `${year}-${month}-${day}`,
      time: `${hours}:${!minutes ? '00': minutes}:00`,
      user_id: user.id,
      table_id
    };

    console.dir(table);

    db.query(`SELECT * FROM reservation WHERE day = ${table.day} AND table_id = ${table_id}`, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server error");
      } else {
        console.log(results);
        const check = results.map(result => result.time === table.time);
        console.log(check);
        if (check.length > 0) {
          res.status(400).json( { msg: "This hour is unavailable" } )
        } 
        else if(date < Date.now()) {
          res.status(400).json( { msg: "This hour has expired" } )
        }
        else {
          db.query("INSERT INTO reservation SET ?", table, err => {
            if (err) {
              console.log(err);
              res.status(500).send("Server error");
            } else res.status(201).json({ msg: "Table reserved" });
          });
        }
      }
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
            } else res.status(200).json({ msg: "Reservation deleted" });
          });
        } else {
          res.status(403).json({ msg: "You don't have permission" });
        }
      }
    }
  );
});

module.exports = router;
