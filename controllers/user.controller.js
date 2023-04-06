const User = require('../models/user.schema');

// Create a single product
// const createUser = (req, res) => {
//     const newUser = new User(req.body);
//     newUser.save((err) => {
//         if (err) {
//             res.status(500).json({
//                 error: 'There was a server side error!',
//             });
//         } else {
//             res.status(200).json({
//                 message: 'User was inserted successfully!',
//             });
//         }
//     });
// };

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const { email } = req.params;

        if (user) {
            const response = await User.updateOne({ email }, user, { upsert: true });
            res.status(200).send(response);
        } else {
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
};
const getAllUser = (req, res) => {
    User.find({}, (err, data) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                result: data,
                message: 'Success',
            });
        }
    });
};
const getUserById = (req, res) => {
    User.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                result: data,
                message: 'Success',
            });
        }
    });
};

module.exports = { createUser, getAllUser, getUserById };
