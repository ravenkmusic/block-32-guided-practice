const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db')
const app = express()


//deployment routes

app.use(express.json()); //parsing requests from incoming requests
app.use(require('morgan')('dev')) // logs requests as they come

//CRUD operations routes

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
}

//invoking init function
init();