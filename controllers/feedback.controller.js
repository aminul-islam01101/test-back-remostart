const Feedback = require('../models/feedback.schema');

const addFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = await Feedback.create({ name, email, message });
        res.status(201).json({
            status: 'success',
            message: ' For your valuable feedback. We will response you within a short time',
        });
    } catch (error) {
        // console.log(error.message)
        res.status(401).json({ status: 'failed', message: error.message });
    }
};
module.exports = addFeedback;
