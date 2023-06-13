# VisualAgenda_Backend

Dies ist das Backend für die Visual Agenda-Anwendung. Es handelt sich um eine RESTful API, die mit Express.js und MySQL entwickelt wurde.

## Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Datenbank-Konfiguration](#datenbank-konfiguration)
- [Verwendung](#verwendung)
- [API-Endpunkte](#api-endpunkte)

## Voraussetzungen

Um das Backend ausführen zu können, benötigen Sie die folgenden Voraussetzungen:

- Node.js (Version 12 oder höher)
- MySQL-Datenbank

## Installation

1. Klone das Repository auf deinen lokalen Computer.
2. Navigiere in das Verzeichnis des Projekts.
3. Führe den Befehl `npm install` aus, um die Abhängigkeiten zu installieren.

## Datenbank-Konfiguration

1. Stelle sicher, dass du eine MySQL-Datenbank eingerichtet hast.
2. Öffne die Datei `server.js` und passe die Verbindungsinformationen für die MySQL-Datenbank an (Host, Benutzername, Passwort, Datenbankname).

## Verwendung

1. Führe den Befehl `npm start` aus, um den Server zu starten. Der Server wird auf Port 3000 gestartet.
2. Verwende eine API-Testanwendung wie Postman oder cURL, um die verschiedenen API-Endpunkte zu testen.

## API-Endpunkte

- `POST /meetings`: Erstellt ein neues Meeting.
- `GET /meetings`: Ruft alle Meetings ab.
- `GET /meetings/:id`: Ruft ein einzelnes Meeting anhand der ID ab.
- `PUT /meetings/:id`: Aktualisiert ein Meeting.
- `DELETE /meetings/:id`: Löscht ein Meeting.
- `POST /timeslots`: Erstellt einen neuen Timeslot.
- `GET /timeslots/:meeting_id`: Ruft alle Timeslots eines Meetings ab.
- `PUT /timeslots/:id`: Aktualisiert einen Timeslot.
- `DELETE /timeslots/:id`: Löscht einen Timeslot.
- `POST /comments`: Erstellt einen neuen Comment.
- `GET /comments/:timeslot_id`: Ruft alle Comments eines Timeslots ab.
- `PUT /comments/:id`: Aktualisiert einen Comment.
- `DELETE /comments/:id`: Löscht einen Comment.
