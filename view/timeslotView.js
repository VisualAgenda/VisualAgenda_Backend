const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TimeslotView = {
  getByMeetingId: async (meetingId) => {
    try {
      const timeslots = await prisma.timeslot.findMany({
        where: {
          meetingId: parseInt(meetingId),
        },
        include: {
          meeting: true,
          comments: true,
        },
      });

      return timeslots;
    } catch (error) {
      throw new Error('Fehler beim Abrufen der Timeslots');
    }
  },

  getById: async (timeslotId) => {
    try {
      const timeslot = await prisma.timeslot.findUnique({
        where: {
          id: timeslotId,
        },
        include: {
          meeting: true,
          comments: true,
        },
      });

      if (timeslot) {
        return timeslot;
      } else {
        throw new Error('Timeslot nicht gefunden');
      }
    } catch (error) {
      throw new Error('Fehler beim Abrufen des Timeslots');
    }
  },
};

module.exports = TimeslotView;
