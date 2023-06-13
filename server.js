const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// MySQL-Datenbankverbindung erstellen
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0806',
});

// Funktion zum Erstellen der Datenbank und Tabellen
function createDatabaseAndTables() {
    // SQL-Befehl zum Erstellen der Datenbank
    const createDatabaseSQL = `CREATE DATABASE IF NOT EXISTS visual_agenda`;

    connection.query(createDatabaseSQL, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Datenbank visual_agenda erstellt');

        // Datenbankverbindung zur erstellten Datenbank ändern
        connection.changeUser({database: 'visual_agenda'}, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            createMeetingsTable();
        });
    });
}

// Funktion zum Erstellen der Meetings-Tabelle
function createMeetingsTable() {
    // SQL-Befehl zur Erstellung der Meetings-Tabelle
    const createMeetingsTableSQL = `
    CREATE TABLE IF NOT EXISTS Meetings (
      meeting_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      start_date DATE NOT NULL,
      admin_link VARCHAR(255) NOT NULL,
      user_link VARCHAR(255) NOT NULL
    )
  `;

    connection.query(createMeetingsTableSQL, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Meetings-Tabelle erstellt');
        createTimeslotsTable();
    });
}

// Funktion zum Erstellen der Timeslots-Tabelle
function createTimeslotsTable() {
    // SQL-Befehl zur Erstellung der Timeslots-Tabelle
    const createTimeslotsTableSQL = `
    CREATE TABLE IF NOT EXISTS Timeslots (
      timeslot_id INT AUTO_INCREMENT PRIMARY KEY,
      meeting_id INT NOT NULL,
      topic VARCHAR(255) NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      FOREIGN KEY (meeting_id) REFERENCES Meetings(meeting_id) ON DELETE CASCADE
    )
  `;

    connection.query(createTimeslotsTableSQL, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Timeslots-Tabelle erstellt');
        createCommentsTable();
    });
}

// Funktion zum Erstellen der Comments-Tabelle
function createCommentsTable() {
    // SQL-Befehl zur Erstellung der Comments-Tabelle
    const createCommentsTableSQL = `
    CREATE TABLE IF NOT EXISTS Comments (
      comment_id INT AUTO_INCREMENT PRIMARY KEY,
      timeslot_id INT NOT NULL,
      comment TEXT NOT NULL,
      FOREIGN KEY (timeslot_id) REFERENCES Timeslots(timeslot_id) ON DELETE CASCADE
    )
  `;

    connection.query(createCommentsTableSQL, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Comments-Tabelle erstellt');
        startServer();
    });
}

// Server starten
function startServer() {
    app.listen(3000, () => {
        console.log('Server läuft auf Port 3000');
    });
}

// Endpunkt zum Erstellen eines neuen Meetings
app.post('/meetings', (req, res) => {
    const {name, start_date} = req.body;

    // Generiere zufällige Links
    const admin_link = generateRandomLink();
    const user_link = generateRandomLink();

    // SQL-Befehl zum Einfügen eines neuen Meetings
    const insertMeetingSQL = `INSERT INTO Meetings (name, start_date, admin_link, user_link) VALUES (?, ?, ?, ?)`;
    const values = [name, start_date, admin_link, user_link];

    // Meeting in der Datenbank erstellen
    connection.query(insertMeetingSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Erstellen des Meetings'});
        }

        // Erfolgreiche Erstellung des Meetings
        const meetingId = result.insertId;
        return res.status(201).json({message: 'Meeting erfolgreich erstellt', meetingId});
    });
});

// Endpunkt zum Abrufen aller Meetings
app.get('/meetings', (req, res) => {
    // SQL-Befehl zum Abrufen aller Meetings
    const getAllMeetingsSQL = `SELECT * FROM Meetings`;

    // Meetings aus der Datenbank abrufen
    connection.query(getAllMeetingsSQL, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Abrufen der Meetings'});
        }

        // Erfolgreiches Abrufen der Meetings
        return res.json(results);
    });
});

// Endpunkt zum Abrufen eines einzelnen Meetings
app.get('/meetings/:id', (req, res) => {
    const meetingId = req.params.id;

    // SQL-Befehl zum Abrufen eines einzelnen Meetings
    const getMeetingSQL = `SELECT * FROM Meetings WHERE meeting_id = ?`;
    const values = [meetingId];

    // Meeting aus der Datenbank abrufen
    connection.query(getMeetingSQL, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Abrufen des Meetings'});
        }

        if (results.length === 0) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        // Erfolgreiches Abrufen des Meetings
        return res.json(results[0]);
    });
});

// Endpunkt zum Aktualisieren eines Meetings
app.put('/meetings/:id', (req, res) => {
    const meetingId = req.params.id;
    const {name, start_date} = req.body;

    // SQL-Befehl zum Aktualisieren eines Meetings
    const updateMeetingSQL = `UPDATE Meetings SET name = ?, start_date = ? WHERE meeting_id = ?`;
    const values = [name, start_date, meetingId];

    // Meeting in der Datenbank aktualisieren
    connection.query(updateMeetingSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Aktualisieren des Meetings'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        // Erfolgreiche Aktualisierung des Meetings
        return res.json({message: 'Meeting erfolgreich aktualisiert'});
    });
});

// Endpunkt zum Löschen eines Meetings
app.delete('/meetings/:id', (req, res) => {
    const meetingId = req.params.id;

    // SQL-Befehl zum Löschen eines Meetings
    const deleteMeetingSQL = `DELETE FROM Meetings WHERE meeting_id = ?`;
    const values = [meetingId];

    // Meeting aus der Datenbank löschen
    connection.query(deleteMeetingSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Löschen des Meetings'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        // Erfolgreiches Löschen des Meetings
        return res.json({message: 'Meeting erfolgreich gelöscht'});
    });
});

// Endpunkt zum Erstellen eines neuen Timeslots
app.post('/timeslots', (req, res) => {
    const {meeting_id, topic, start_time, end_time} = req.body;

    // SQL-Befehl zum Einfügen eines neuen Timeslots
    const insertTimeslotSQL = `INSERT INTO Timeslots (meeting_id, topic, start_time, end_time) VALUES (?, ?, ?, ?)`;
    const values = [meeting_id, topic, start_time, end_time];

    // Timeslot in der Datenbank erstellen
    connection.query(insertTimeslotSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Erstellen des Timeslots'});
        }

        // Erfolgreiche Erstellung des Timeslots
        const timeslotId = result.insertId;
        return res.status(201).json({message: 'Timeslot erfolgreich erstellt', timeslotId});
    });
});

// Endpunkt zum Abrufen aller Timeslots eines Meetings
app.get('/timeslots/:meeting_id', (req, res) => {
    const meetingId = req.params.meeting_id;

    // SQL-Befehl zum Abrufen aller Timeslots eines Meetings
    const getTimeslotsSQL = `SELECT * FROM Timeslots WHERE meeting_id = ?`;
    const values = [meetingId];

    // Timeslots aus der Datenbank abrufen
    connection.query(getTimeslotsSQL, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Abrufen der Timeslots'});
        }

        // Erfolgreiches Abrufen der Timeslots
        return res.json(results);
    });
});

// Endpunkt zum Aktualisieren eines Timeslots
app.put('/timeslots/:id', (req, res) => {
    const timeslotId = req.params.id;
    const {topic, start_time, end_time} = req.body;

    // SQL-Befehl zum Aktualisieren eines Timeslots
    const updateTimeslotSQL = `UPDATE Timeslots SET topic = ?, start_time = ?, end_time = ? WHERE timeslot_id = ?`;
    const values = [topic, start_time, end_time, timeslotId];

    // Timeslot in der Datenbank aktualisieren
    connection.query(updateTimeslotSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Aktualisieren des Timeslots'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Timeslot nicht gefunden'});
        }

        // Erfolgreiche Aktualisierung des Timeslots
        return res.json({message: 'Timeslot erfolgreich aktualisiert'});
    });
});

// Endpunkt zum Löschen eines Timeslots
app.delete('/timeslots/:id', (req, res) => {
    const timeslotId = req.params.id;

    // SQL-Befehl zum Löschen eines Timeslots
    const deleteTimeslotSQL = `DELETE FROM Timeslots WHERE timeslot_id = ?`;
    const values = [timeslotId];

    // Timeslot aus der Datenbank löschen
    connection.query(deleteTimeslotSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Löschen des Timeslots'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Timeslot nicht gefunden'});
        }

        // Erfolgreiches Löschen des Timeslots
        return res.json({message: 'Timeslot erfolgreich gelöscht'});
    });
});

// Endpunkt zum Erstellen eines neuen Comments
app.post('/comments', (req, res) => {
    const {timeslot_id, content} = req.body;

    // SQL-Befehl zum Einfügen eines neuen Comments
    const insertCommentSQL = `INSERT INTO Comments (timeslot_id, content) VALUES (?, ?)`;
    const values = [timeslot_id, content];

    // Comment in der Datenbank erstellen
    connection.query(insertCommentSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Erstellen des Comments'});
        }

        // Erfolgreiche Erstellung des Comments
        const commentId = result.insertId;
        return res.status(201).json({message: 'Comment erfolgreich erstellt', commentId});
    });
});

// Endpunkt zum Abrufen aller Comments eines Timeslots
app.get('/comments/:timeslot_id', (req, res) => {
    const timeslotId = req.params.timeslot_id;

    // SQL-Befehl zum Abrufen aller Comments eines Timeslots
    const getCommentsSQL = `SELECT * FROM Comments WHERE timeslot_id = ?`;
    const values = [timeslotId];

    // Comments aus der Datenbank abrufen
    connection.query(getCommentsSQL, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Abrufen der Comments'});
        }

        // Erfolgreiches Abrufen der Comments
        return res.json(results);
    });
});

// Endpunkt zum Aktualisieren eines Comments
app.put('/comments/:id', (req, res) => {
    const commentId = req.params.id;
    const {content} = req.body;

    // SQL-Befehl zum Aktualisieren eines Comments
    const updateCommentSQL = `UPDATE Comments SET content = ? WHERE comment_id = ?`;
    const values = [content, commentId];

    // Comment in der Datenbank aktualisieren
    connection.query(updateCommentSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Aktualisieren des Comments'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Comment nicht gefunden'});
        }

        // Erfolgreiche Aktualisierung des Comments
        return res.json({message: 'Comment erfolgreich aktualisiert'});
    });
});

// Endpunkt zum Löschen eines Comments
app.delete('/comments/:id', (req, res) => {
    const commentId = req.params.id;

    // SQL-Befehl zum Löschen eines Comments
    const deleteCommentSQL = `DELETE FROM Comments WHERE comment_id = ?`;
    const values = [commentId];

    // Comment aus der Datenbank löschen
    connection.query(deleteCommentSQL, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Fehler beim Löschen des Comments'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Comment nicht gefunden'});
        }

        // Erfolgreiches Löschen des Comments
        return res.json({message: 'Comment erfolgreich gelöscht'});
    });
});


// Hilfsfunktion zum Generieren eines zufälligen Links
function generateRandomLink() {
    const randomBytes = crypto.randomBytes(10);
    return randomBytes.toString('hex');
}

// Datenbank erstellen und Server starten
connection.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }

    createDatabaseAndTables();
});
