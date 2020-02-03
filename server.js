const express = require('express');
const db = require('./config/db');

const app = express();

// Connect to database
db.connect();

app.get('/', (req, res) => res.send('API RUNNING'));

app.get('/adduser', async (req, res) => {
    const user = {
        username: 'Arian',
        email: 'arian.orwat@gmail.com',
        password: 'pass',
        image: './userImage/1',
        created: new Date(),
        passwordDate: new Date()
    };

    await db.query('INSERT INTO users SET ?', user);
    res.send("User created"); 
});

app.get('/checkdate/:id', (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ${req.params.id}`
    db.query(sql, (err, result) => {
        if (err) res.send("DATABASE ERROR");
        else if(result.length === 0) res.send("ERROR USER NOT FIND");
        else {
            const user = result[0];
            if(new Date() > user.created) console.log("Yeeey");
            res.send(user);
        }
    });
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));