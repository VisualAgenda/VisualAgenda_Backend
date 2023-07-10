const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// View zum Abrufen aller Meetings
const getAllMeetings = async () => {
  try {
    const meetings = await prisma.meeting.findMany();
    return meetings;
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Abrufen der Meetings");
  }
};

// View zum Abrufen eines einzelnen Meetings
const getMeetingById = async (meetingId) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
      },
    });
    if (!meeting) {
      throw new Error("Meeting nicht gefunden");
    }
    return meeting;
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Abrufen des Meetings");
  }
};

// View zum Aktualisieren eines Meetings
const updateMeeting = async (meetingId, name, startDate) => {
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        name,
        startDate,
      },
    });
    return updatedMeeting;
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Aktualisieren des Meetings");
  }
};

// View zum Löschen eines Meetings
const deleteMeeting = async (meetingId) => {
  try {
    await prisma.meeting.delete({
      where: {
        id: meetingId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Löschen des Meetings");
  }
};
module.exports = {
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};
