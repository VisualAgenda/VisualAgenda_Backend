const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const commentsRoutes = require('./routes/commentsRoutes');
const meetingsRoutes = require('./routes/meetingsRoutes');
const timeslotRoutes = require('./routes/timeslotRoutes');

const app = express();
const port = 3000;

// Erstelle den HTTP-Server
const server = http.createServer(app);

// Erstelle den Socket.IO-Server
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/', meetingsRoutes);
app.use('/', commentsRoutes);
app.use('/', timeslotRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal Server Error'});
});

// Socket.IO-Serverkonfiguration
io.on('connection', (socket) => {
    console.log('Neue Verbindung hergestellt:', socket.id);

    // Timer starten oder aktuellen Status übermitteln
    socket.emit('timerStatus', { timerValue });

    // Timer starten
    socket.on('startTimer', () => {
        // Überprüfe, ob der Timer bereits gestartet wurde
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                // Inkrementiere den Timerwert
                timerValue++;

                // Sende den aktualisierten Timerwert an alle Benutzer
                io.emit('timerStatus', { timerValue });
            }, 1000); // Aktualisiere den Timer alle 1 Sekunde
        }
    });

    // Timer stoppen
    socket.on('stopTimer', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    socket.on('disconnect', () => {
        console.log('Verbindung getrennt:', socket.id);
    });
});

// Starte den Server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
