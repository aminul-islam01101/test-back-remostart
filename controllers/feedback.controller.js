const Feedback = require('../models/feedback.schema');

const addFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = await Feedback.create({ name, email, message });
        res.status(201).json({ status: 'success', message: " For your valuable feedback. We will response you within a short time"});
    } catch (error) {
        res.status(403).json(error.message);
    }
};
module.exports = addFeedback;