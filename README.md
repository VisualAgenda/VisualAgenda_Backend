VisualAgenda Backend
This is the backend component of VisualAgenda, a web application for managing meetings and timeslots visually. The backend provides APIs to create, retrieve, update, and delete meetings, timeslots, and comments.

Prerequisites
To run this application, you need to have the following installed:

Node.js
npm (Node Package Manager)
PostgreSQL
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
Navigate to the project directory:

bash
Copy code
cd VisualAgenda_Backend
Install the dependencies:

bash
Copy code
npm install
Set up the PostgreSQL database:

Create a new PostgreSQL database.
Update the database configuration in the prisma/.env file.
Apply database migrations:

bash
Copy code
npx prisma migrate dev
Start the application:

bash
Copy code
npm start
The backend server will start running at http://localhost:3000.

Usage
The backend provides the following API endpoints:

Meetings
POST /meetings: Create a new meeting.
GET /meetings: Retrieve all meetings.
GET /meetings/:link: Retrieve a single meeting by link.
PUT /meetings/:link: Update a meeting by link.
DELETE /meetings/:link: Delete a meeting by link.
Timeslots
POST /timeslots/:meetingLink: Create a new timeslot for a meeting.
GET /timeslots/:meetingLink: Retrieve all timeslots for a meeting.
GET /timeslots/:timeslotId: Retrieve a single timeslot by ID.
PUT /timeslots/:timeslotId: Update a timeslot by ID.
DELETE /timeslots/:timeslotId: Delete a timeslot by ID.
Comments
POST /comments/:timeslotId: Create a new comment for a timeslot.
GET /comments/:timeslotId: Retrieve all comments for a timeslot.
GET /comments/:timeslotId/:commentId: Retrieve a single comment by ID for a timeslot.
PUT /comments/:commentId: Update a comment by ID.
DELETE /comments/:commentId: Delete a comment by ID.
Make requests to these endpoints using your preferred HTTP client (e.g., cURL, Postman, or a web browser extension).

