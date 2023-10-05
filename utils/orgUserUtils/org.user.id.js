/* eslint-disable radix */
const orgUser = require('../../models/orgModels/org.usr.schema');

// import { orgUser } from './org.user.schema';

// Marketing ID
const findLastMarketerId = async () => {
    const lastMarketer = await orgUser
        .findOne({ role: 'marketer' }, { id: 1, _id: 0 })
        .sort({
            createdAt: -1,
        })
        .lean();

    return lastMarketer?.id ? lastMarketer.id.substring(4) : undefined;
};

const generateMarketerId = async () => {
    const currentId = (await findLastMarketerId()) || (0).toString().padStart(5, '0');
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
    incrementedId = `MAR-${incrementedId}`;

    return incrementedId;
};

// content creator ID
const findLastContentCreatorId = async () => {
    const lastContentCreator = await orgUser
        .findOne({ role: 'content_creator' }, { id: 1, _id: 0 })
        .sort({
            createdAt: -1,
        })
        .lean();

    return lastContentCreator?.id ? lastContentCreator.id.substring(4) : undefined;
};

const generateContentCreatorId = async () => {
    const currentId = (await findLastContentCreatorId()) || (0).toString().padStart(5, '0');
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
    incrementedId = `CON-${incrementedId}`;

    return incrementedId;
};
// development ID
const findLastDevelopmentId = async () => {
    const lastDeveloper = await orgUser
        .findOne({ role: 'developer' }, { id: 1, _id: 0 })
        .sort({
            createdAt: -1,
        })
        .lean();

    return lastDeveloper?.id ? lastDeveloper.id.substring(4) : undefined;
};

const generateDevelopmentId = async () => {
    const currentId = (await findLastDevelopmentId()) || (0).toString().padStart(5, '0');
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
    incrementedId = `DEV-${incrementedId}`;

    return incrementedId;
};

// Admin ID
const findLastAdminId = async () => {
    const lastAdmin = await orgUser
        .findOne({ role: 'admin' }, { id: 1, _id: 0 })
        .sort({
            createdAt: -1,
        })
        .lean();

    return lastAdmin?.id ? lastAdmin.id.substring(3) : undefined;
};

const generateAdminId = async () => {
    const currentId = (await findLastAdminId()) || (0).toString().padStart(5, '0');
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
    incrementedId = `AD-${incrementedId}`;

    return incrementedId;
};
module.exports = {
    generateAdminId,
    generateDevelopmentId,
    generateContentCreatorId,
    generateMarketerId,
};
