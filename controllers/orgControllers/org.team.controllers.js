const User = require('../../models/user.schema');

module.exports.inHouseStartups = async (req, res) => {
    try {
        const startupData = await User.find({ signInMethod: 'in-house', role: 'startup' });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully !',
            data: startupData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'There is an error',
        });
    }
};
