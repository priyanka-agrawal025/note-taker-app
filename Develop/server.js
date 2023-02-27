const express = require('express');
const lowdb = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const adapter = new fileSync('./db/db.json');
const db = lowdb(adapter);

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// Get all notes
app.get('/api/notes', (req, res) => {
    const notes = db.get('notes').value();
    res.json(notes);
})
// Insert a new note
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const newNote = {id:uuidv4(), title, text};
    db.get('notes').push(newNote).write();
    res.json(newNote);
})

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    db.get('notes').remove({id}).write();
    res.json({message: `Note with id ${id} has been deleted`});
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

