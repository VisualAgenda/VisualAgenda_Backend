const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new comment for a timeslot
async function createComment(req, res) {
    const link = req.params.link;
    const timeslotId = parseInt(req.params.timeslotId);
    const {comment} = req.body;

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

        const timeslot = await prisma.timeslots.findFirst({
            where: {timeslot_id: timeslotId, meeting_id: meeting.meeting_id},
        });

        if (!timeslot) {
            return res.status(404).json({error: 'Timeslot nicht gefunden'});
        }

        await prisma.comments.create({
            data: {
                comment,
                timeslots: {
                    connect: {timeslot_id: timeslotId},
                },
            },
        });

        res.status(201).json({
            message: 'Comment erfolgreich erstellt',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Erstellen des Comments'});
    }
}

// Retrieve all comments for a timeslot
async function getAllComments(req, res) {
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

        const timeslot = await prisma.timeslots.findFirst({
            where: {timeslot_id: timeslotId, meeting_id: meeting.meeting_id},
        });

        if (!timeslot) {
            return res.status(404).json({error: 'Timeslot nicht gefunden'});
        }

        const comments = await prisma.comments.findMany({
            where: {timeslot_id: timeslotId},
        });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Abrufen der Comments'});
    }
}

// Delete a comment
async function deleteComment(req, res) {
    const link = req.params.link;
    const commentId = parseInt(req.params.commentId);

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

        await prisma.comments.delete({
            where: {comment_id: commentId},
        });

        res.json({message: 'Comment erfolgreich gelöscht'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Löschen des Comments'});
    }
}

async function getCommentWithId(req, res) {
    const link = req.params.link;
    const timeslotId = parseInt(req.params.timeslotId);
    const commentId = parseInt(req.params.commentId);

    try {
        const meeting = await prisma.meetings.findFirst({
            where: {
                // Überprüfen, ob der Link mit dem Admin-Link
                admin_link: link
            },
        });

        if (!meeting) {
            return res.status(404).json({error: 'Meeting nicht gefunden'});
        }

        const comment = await prisma.comments.findFirst({
            where: {timeslot_id: timeslotId, comment_id: commentId},
        });

        if (!comment) {
            return res.status(404).json({error: 'Kommentar nicht gefunden'});
        }

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Abrufen des Kommentars'});
    }
}

module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    getCommentWithId,
};
