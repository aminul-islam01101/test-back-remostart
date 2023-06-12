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
    const { email, jobId, status,stage } = req.body;

    try {
            const remoforce = await Remoforce.findOne({ email });

           const notificationToUpdate= remoforce.notifications.find(job => job.jobId===jobId && job.stage===stage);
           notificationToUpdate.status=status;
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
const startupMakeRead = async (req, res) => {
    const { email, jobId, status,stage } = req.body;

    console.log(req.body)

    try {
            const startup = await Startup.findOne({ email });

           const notificationToUpdate= startup.notifications.find(job => job.jobId===jobId && job.stage===stage);
           notificationToUpdate.status=status;
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

module.exports = { getRemoforceNotifications, remoMakeRead, getStartupNotifications,startupMakeRead };
