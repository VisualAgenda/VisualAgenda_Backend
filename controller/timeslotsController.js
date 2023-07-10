const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new timeslot for a meeting
async function createTimeslot(req, res) {
    const {topic, start_time, end_time, link} = req.body;

    try {
        const meeting = await prisma.meetings.findFirst({
                where: {
                    // Überprüfen, ob der Link mit dem Admin-Link oder User-Link übereinstimmt
                    admin_link: link
                    ,
                },
            })
        ;

        if (!meeting) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        const timeslot = await prisma.timeslots.create({
            data: {
                topic,
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                meeting: {
                    connect: {
                        meeting_id: meeting.meeting_id,
                    },
                },
            },
        });

        res.status(201).json({message: 'Timeslot erfolgreich erstellt', timeslot});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Erstellen des Timeslots'});
    }
}

// Retrieve all timeslots for a meeting
async function getAllTimeslots(req, res) {
    const link = req.params.link;

    try {
        const meeting = await prisma.meetings.findFirst({
            where: {
                // Überprüfen, ob der Link mit dem Admin-Link oder User-Link übereinstimmt
                OR: [
                    {admin_link: link},
                    {user_link: link}
                ]
            },
        });

        if (!meeting) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        const timeslots = await prisma.timeslots.findMany({
            where: {meeting_id: meeting.meeting_id},
        });

        res.json(timeslots);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Abrufen der Timeslots'});
    }
}

// Retrieve a single timeslot by ID
async function getTimeslot(req, res) {
    const link = req.params.link;
    const timeslotId = parseInt(req.params.timeslotId);

    try {
        const meeting = await prisma.meetings.findFirst({
            where: {
                // Überprüfen, ob der Link mit dem Admin-Link oder User-Link übereinstimmt
                OR: [
                    {admin_link: link},
                    {user_link: link}
                ]
            },
        });

        if (!meeting) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        const timeslot = await prisma.timeslots.findUnique({
            where: {timeslot_id: timeslotId},
        });

        if (!timeslot || timeslot.meeting_id !== meeting.meeting_id) {
            return res.status(404).json({error: 'Timeslot nicht gefunden'});
        }

        res.json(timeslot);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Abrufen des Timeslots'});
    }
}

// Update a timeslot
async function updateTimeslot(req, res) {
    const link = req.params.link;
    const timeslotId = parseInt(req.params.timeslotId);
    const {topic, startTime, endTime} = req.body;

    try {
        const meeting = await prisma.meetings.findFirst({
            where: {
                // Überprüfen, ob der Link mit dem Admin-Link oder User-Link übereinstimmt
                admin_link: link,
            },
        });

        if (!meeting) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        const formattedStartTime = new Date(`1970-01-01T${startTime}`);
        const formattedEndTime = new Date(`1970-01-01T${endTime}`);

        const updatedTimeslot = await prisma.timeslots.update({
            where: {timeslot_id: timeslotId},
            data: {
                topic,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
            },
        });

        res.json({
            message: 'Timeslot erfolgreich aktualisiert',
            timeslot: updatedTimeslot,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Aktualisieren des Timeslots'});
    }
}

// Delete a timeslot
async function deleteTimeslot(req, res) {
    const link = req.params.link;
    const timeslotId = parseInt(req.params.timeslotId);

    try {
        const meeting = await prisma.meetings.findFirst({
            where: {
                // Überprüfen, ob der Link mit dem Admin-Link oder User-Link übereinstimmt
                admin_link: link
            },
        });

        if (!meeting) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        await prisma.timeslots.delete({
            where: {timeslot_id: timeslotId},
        });

        res.json({message: 'Timeslot erfolgreich gelöscht'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Löschen des Timeslots'});
    }
}

module.exports = {
    createTimeslot,
    getAllTimeslots,
    getTimeslot,
    updateTimeslot,
    deleteTimeslot,
};
