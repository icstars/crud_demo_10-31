const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// cors - Cross-Origin Resource Sharing
// making sure websites only handle requests from themselves
const cors = require('cors')

const app = express();
const port = 5000;

// remember that what's in this file is for MySQL
// Postgres or other DBs won't look exactly the same
// the *ideas* and *concepts* are more or less evergreen though -
// configure the connection to the server,
// figure out how to write a query and insert data into it from the request sent by React
// query the DB and receive a response from it
// figure out how to send that response back to the React app

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // localhost - your local machine
  user: 'root', // Replace with your MySQL username
  port: 6603, // Replace with the port you need - may be different from mine
  password: 'root', // Replace with your MySQL password
  database: 'task_example', // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Middleware to parse JSON and setting up CORS
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));

// CRUD routes
// Read (GET)
// your read queries are generally "SELECT * FROM table",
// "SELECT * FROM table WHERE column = thing", maybe there's a join in there
app.get('/api/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving tasks:', err);
      res.status(500).json({ error: 'Error retrieving tasks' });
    } else {
      res.json(results);
    }
  });
});


// Create (POST)
// create queries pretty much always need to get some data from the request sent
// by React - it's gotta be slipped into that query somehow
// in general, you probably need something for every column except your ID
// (auto-increments) and created at/updated at columns
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';

  db.query(query, [title, description], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ error: 'Error creating task' });
    } else {
      res.status(201).json({ message: 'Task created' });
    }
  });
});

// Delete (DELETE)
// like before, we need to get the ID of the thing we want to delete from React
// it's the same if we wanted to update something too
app.delete('/api/tasks', (req, res) => {

  const task_id = req.body['id'];
  
  const query = 'DELETE FROM tasks WHERE id = (?)';

  db.query(query, [task_id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Error deleting  task' });
    } else {
      res.status(201).json({ message: 'Task deleting ' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
