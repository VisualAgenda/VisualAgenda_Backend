const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new meeting
async function createMeeting(req, res) {
  const { name, start_date } = req.body;

  try {
    const meeting = await prisma.meetings.create({
      data: {
        name,
        start_date: new Date(start_date), // Konvertiere den Wert in ein DateTime-Objekt
        admin_link: generateRandomLink(),
        user_link: generateRandomLink(),
      },
    });

    res.status(201).json({
      message: "Meeting erfolgreich erstellt",
      meetingId: meeting.meeting_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Erstellen des Meetings" });
  }
}

// Retrieve all meetings
async function getAllMeetings(req, res) {
  try {
    const meetings = await prisma.meetings.findMany();

    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Abrufen der Meetings" });
  }
}

// Retrieve a single meeting by link
async function getMeeting(req, res) {
  const link = req.params.link; // Annahme: Der Link wird als Parameter übergeben

  try {
    const meeting = await prisma.meetings.findFirst({
      where: {
        // Überprüfen, ob der Link mit dem Admin-Link übereinstimmt
        OR: [{ admin_link: link }, { user_link: link }],
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting nicht gefunden" });
    }

    const isAdmin = meeting.admin_link === link;

    res.json({ meeting, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Abrufen des Meetings" });
  }
}

// Update a meeting
async function updateMeeting(req, res) {
  const { newName, startDate } = req.body;
  const link = req.params.link;

  try {
    const meeting = await prisma.meetings.findFirst({
      where: {
        // Überprüfen, ob der Link mit dem Admin-Link übereinstimmt
        admin_link: link,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting nicht gefunden" });
    }

    await prisma.meetings.update({
      where: {
        meeting_id: meeting.meeting_id,
      },
      data: {
        name: newName,
        start_date: new Date(startDate),
      },
    });

    res.status(200).json({ message: "Meeting erfolgreich aktualisiert" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Meetings" });
  }
}

// Delete a meeting
async function deleteMeeting(req, res) {
  const link = req.params.link;

  try {
    const meeting = await prisma.meetings.findFirst({
      where: {
        admin_link: link,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting nicht gefunden" });
    }

    await prisma.meetings.delete({
      where: { meeting_id: meeting.meeting_id },
    });

    res.json({ message: "Meeting erfolgreich gelöscht" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Löschen des Meetings" });
  }
}

function generateRandomLink() {
  const randomBytes = crypto.randomBytes(10);
  return randomBytes.toString("hex");
}

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
};
