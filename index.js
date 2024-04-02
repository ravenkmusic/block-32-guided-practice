const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db')
const app = express()


//deployment routes

app.use(express.json()); //parsing requests from incoming requests
app.use(require('morgan')('dev')) // logs requests as they come

//CRUD operations routes

//create

app.post('/api/notes', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO notes (text) VALUES({$1}) RETURNING *
            `;
        const response = await client.query(SQL, [req.body.txt]);
        res.send(response.rows[0]);
    } catch (ex) {
        
    }
});

// read

app.get('/api/notes', async (req, res, next) => {
    try {
        const SQL = `SELECT * from notes ORDER BY created_at DESC`;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (ex) {
        console.error(ex);
    }
});

//update

app.put('/api/notes/:id', async (req, res, next) => {
    try {
        const SQL = `
            UPDATE notes

            SET txt=$1, ranking=$2, upated_at=now()
            
            WHERE id=$3 RETURNING *
        `;
        const response = await client.query(SQL, [req.body.txt, req.body.ranking, req.params.id]);
        res.send(response.rows[0])
    } catch (ex) {
        console.error(ex);
    }
})

// delete

app.delete('/api/notes/:id', async (req, res, next) => {
    try {
        const SQL = `
            DELETE from notes

            WHERE id=$1
        `;
        const response = await client.query(SQL, []);
        res.sendStatus(204);
    } catch (ex) {
        console.error(ex);
    }
})


//connect to database

async function init(){
    await client.connect();
    console.log('Connected to database');
    
    //creating the tables
    let SQL = `
        DROP TABLE IF EXISTS notes
        CREATE TABLE notes(
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            ranking INTEGER DEFAULT 3 NOT NULL,
            txt VARCHAR(255) NOT NULL
            )
        `;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
        INSERT INTO notes (txt, ranking) VALUES('Note 1', 5);
        INSERT INTO notes (txt, ranking) VALUES('Note 2', 1);
        INSERT INTO notes (txt, ranking) VALUES('Note 3', 3);
        `;
    console.log('data seeded.');
    const port = process.env.PORT || 3000; // variable for port
    app.listen(port, ()=> console.log(`Now listening on port ${port}.`)); //listens on port 3000
}

//invoking init function
init();