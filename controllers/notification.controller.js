/* eslint-disable no-param-reassign */
const Remoforce = require('../models/remoForce.schema');
const Startup = require('../models/startup.schema');

const getRemoforceNotifications = async (req, res) => {
    const { email } = req.params;

    try {
        const remoforce = await Remoforce.findOne({ email });

        res.send(remoforce.notifications);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const realRemoforceNotifications = async (email) => {
    try {
        const remoforce = await Remoforce.findOne({ email });

        return remoforce.notifications;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getStartupNotifications = async (req, res) => {
    const { email } = req.params;

    try {
        const startup = await Startup.findOne({ email });

        res.send(startup.notifications);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const remoMakeRead = async (req, res) => {
    const { email, jobId, status, stage } = req.body;

    try {
        const remoforce = await Remoforce.findOne({ email });

        const notificationToUpdate = remoforce.notifications.find(
            (job) => job.jobId === jobId && job.stage === stage
        );
        notificationToUpdate.status = status;
        await remoforce.save();
        // const remoforce = await Remoforce.findOneAndUpdate(
        //     { email, 'notifications.jobId': jobId, 'notifications.stage': stage },
        //     { $set: { 'notifications.$.status': status } }
        // );

        if (remoforce) {
            res.send('made read');
        } else {
            res.status(404).send('Notification not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const remoforceMakeAllRead = async (req, res) => {
    const { email } = req.params; // Use req.params instead of req.par

    try {
        const remoforce = await Remoforce.findOne({ email });

        if (!remoforce) {
            return res.status(404).send('User not found');
        }

        // Loop through all notifications and update their status to "read"
        if (remoforce.notifications && remoforce.notifications.length > 0) {
            remoforce.notifications.forEach((notification) => {
                notification.status = 'read';
            });
        }

        await remoforce.save(); // Save the changes

        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const startupMakeRead = async (req, res) => {
    const { email, jobId, status, stage } = req.body;

    console.log(req.body);

    try {
        const startup = await Startup.findOne({ email });

        const notificationToUpdate = startup.notifications.find(
            (job) => job.jobId === jobId && job.stage === stage
        );
        notificationToUpdate.status = status;
        await startup.save();

        if (startup) {
            res.send('made read');
        } else {
            res.status(404).send('Notification not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const startupMakeAllRead = async (req, res) => {
    const { email } = req.params; // Use req.params instead of req.par

    try {
        const startup = await Startup.findOne({ email });

        if (!startup) {
            return res.status(404).send('User not found');
        }

        // Loop through all notifications and update their status to "read"
        if (startup.notifications && startup.notifications.length > 0) {
            startup.notifications.forEach((notification) => {
                notification.status = 'read';
            });
        }

        await startup.save(); // Save the changes

        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    realRemoforceNotifications,
    getRemoforceNotifications,
    remoMakeRead,
    getStartupNotifications,
    startupMakeRead,
    remoforceMakeAllRead,
    startupMakeAllRead,
};
