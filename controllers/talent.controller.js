/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const Remoforce = require('../models/remoForce.schema');
const Startup = require('../models/startup.schema');
const Payment = require('../models/payment.scheema');

const getMatchedTalents = async (req, res) => {
    const queryData = req.body;

    // queryData: {
    //     email: 'cigemig458@v2ssr.com',
    //     tier: 'Free',
    //     transactionId: null,
    //     selectedSkills: [ [Object] ],
    //     locationPreference: [ 'Remote' ],
    //     selectedLanguages: [ 'English' ],
    //     softSkills: [ 'Adaptability', 'Active listening' ],
    //     requiredTalents: '6',
    //     details: { title: 'paypal developer', description: 'asdfasfsdfsfsfsfsfsdf' }
    //   }

    try {
        const docs = await Remoforce.find({
            $or: [
                { 'selectedLanguages.language': { $in: queryData.selectedLanguages } },
                { softSkills: { $all: queryData.softSkills } },
                { selectedSkills: { $elemMatch: { $or: queryData.selectedSkills } } },
                { 'personalDetails.country': { $in: queryData.locationPreference } },
            ],
        });

        const results = [];

        docs.forEach((doc) => {
            let score = 0;

            // if (
            //     doc.jobPreference &&
            //     doc.jobPreference.locationPreference === queryData.locationPreference
            // ) {
            //     score += 100;
            // }

            if (queryData.locationPreference[0] === 'Remote') {
                score += 100;
            } else {
                const locationIntersection = queryData.locationPreference.find(
                    (location) => location === doc?.personalDetails?.country
                );
                if (locationIntersection) {
                    score += 100;
                } else {
                    score += 0;
                }
            }

            const softSkillsIntersection = doc.softSkills.filter((skill) =>
                queryData.softSkills.includes(skill)
            );
            if (softSkillsIntersection.length === queryData.softSkills.length) {
                score += 100;
            } else {
                score += (softSkillsIntersection.length / queryData.softSkills.length) * 100;
            }

            const selectedLanguagesIntersection = doc.selectedLanguages.filter((lang) =>
                queryData.selectedLanguages.includes(lang.language)
            );
            if (selectedLanguagesIntersection.length === queryData.selectedLanguages.length) {
                score += 100;
            } else {
                score +=
                    (selectedLanguagesIntersection.length / queryData.selectedLanguages.length) *
                    100;
            }

            let selectedSkillsScore = 0;
            const selectedSkillsCount = queryData.selectedSkills.length;
            queryData.selectedSkills.forEach((skill) => {
                const matchedSkill = doc.selectedSkills.find(
                    (docSkill) =>
                        docSkill.skillName === skill.skillName && docSkill.level === skill.level
                );
                if (matchedSkill) {
                    selectedSkillsScore += 1;
                }
            });

            if (selectedSkillsCount > 0) {
                selectedSkillsScore /= selectedSkillsCount;
                selectedSkillsScore *= 100;
            }

            score += selectedSkillsScore;
            const scorePercentage = Math.ceil((score / 400) * 100);

            results.push({
                ...doc.toObject(),
                scorePercentage,
            });
        });
        results.sort((a, b) => b.scorePercentage - a.scorePercentage);
        let sortedTalent = [];
        if (results.length) {
            // todo: score percentage should be updated (now its floor is only 10 to match more talent, it should be updated to 50 as least)
            // const talentScoreFilter = results.filter((talent) => talent.scorePercentage >= 10);
            const talentScoreFilter = results.filter((talent) => talent.scorePercentage >= 10);
            if (talentScoreFilter.length >= queryData.requiredTalents) {
                sortedTalent = talentScoreFilter.slice(0, queryData.requiredTalents);
            } else {
                sortedTalent = talentScoreFilter;
            }
        }
        const requiredTalentsInHistory = sortedTalent.map((talent) => ({
            email: talent.email,
            fullName: talent.fullName,
            country: talent?.personalDetails?.country,
            skillLevel: talent.jobPreference.jobLevel,
            scorePercentage: talent.scorePercentage,
            interviewStatus: 'not requested',
        }));
        const talentHistory = {
            searchQuery: queryData,
            requiredTalentsInHistory,
        };
        //  update startup user with search history
        const startupUser = await Startup.findOne({ email: queryData.email });
        // const tier = queryData.tier.toLowerCase();
        // const transaction = queryData.transactionId === null
        //     ? 'transactionNull'
        //     : `transaction${queryData.transactionId}`;

        // if (!startupUser.talentRequestHistory) {
        //     startupUser.talentRequestHistory = {};
        // }

        // if (!startupUser.talentRequestHistory[tier]) {
        //     startupUser.talentRequestHistory[tier] = {};
        // }

        // if (!startupUser.talentRequestHistory[tier].searchHistory) {
        //     startupUser.talentRequestHistory[tier].searchHistory = [];
        // }

        // startupUser.talentRequestHistory[tier].transactionId=queryData.transactionId;
        // startupUser.talentRequestHistory[tier].searchHistory.push('something');
        const talentRequestPaymentDetails = startupUser?.talentRequestPaymentDetails;
        const tier = talentRequestPaymentDetails?.tier;
        const transactionId = talentRequestPaymentDetails?.transactionId;

        const maxSearchLimit = {
            tierFREE: 1000,
            tierSTARTER: 7,
            tierTEAM: 50,
            tierBUSINESS: 100,
        };
        // const maxSearchLimit = {
        //     tierFree: 1000,
        //     tier10: 7,
        //     tier29: 50,
        //     tier39: 20,
        // };
        if (!startupUser.talentRequestHistory) {
            startupUser.talentRequestHistory = {};
        }

        if (!startupUser.talentRequestHistory[tier]) {
            startupUser.talentRequestHistory[tier] = [];
        }

        const tierHistory = startupUser.talentRequestHistory[tier];

        const matchedTransactionIndex = tierHistory.findIndex(
            (history) => history.transactionId === transactionId
        );

        if (matchedTransactionIndex >= 0) {
            const history = tierHistory[matchedTransactionIndex];
            if (history.searchHistory.length < maxSearchLimit[tier]) {
                history.searchHistory.push(talentHistory);
            }
        } else {
            const newTransactionHistory = {
                transactionId,
                searchHistory: [talentHistory],
            };
            tierHistory.push(newTransactionHistory);
        }

        // if (matchedTransactionIndex >= 0) {
        //     tierHistory[matchedTransactionIndex].searchHistory.push(talentHistory);
        // } else {
        //     const newTransactionHistory = {
        //         transactionId: queryData.transactionId,
        //         searchHistory: [talentHistory],
        //     };
        //     tierHistory.push(newTransactionHistory);
        // }
        await startupUser.save();
        const startupsRequiredTalentsInHistory = {
            startupsEmail: queryData.email,
            requiredTalentsInHistory,
        };
        // console.log(results);
        res.send(startupsRequiredTalentsInHistory);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};
const getMatchedLastResults = async (req, res) => {
    const { email } = req.query;

    // res.send('route ok')

    try {
        // Find the job post by ID

        let lastSearchResult = {};
        let startupsLastSearchResults = { startupsEmail: email, lastSearchResult };
        const startup = await Startup.findOne({ email });
        if (!startup) {
            throw new Error('No startup found');
        }

        const talentRequestPaymentDetails = startup?.talentRequestPaymentDetails;
        const tier = talentRequestPaymentDetails?.tier;
        const transactionId = talentRequestPaymentDetails?.transactionId;

        if (!startup.talentRequestHistory[tier]?.length) {
            res.send(startupsLastSearchResults);
            return;
        }
        //! check again
        if (startup?.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1]) {
            const isValidTransactionId = startup?.talentRequestHistory[tier].find(
                (eachTransaction) => eachTransaction.transactionId === transactionId
            );
            if (!isValidTransactionId) {
                res.send(startupsLastSearchResults);
                return;
            }

            lastSearchResult =
                startup.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1]
                    ?.searchHistory[
                    startup.talentRequestHistory[tier][
                        startup.talentRequestHistory[tier].length - 1
                    ].searchHistory.length - 1
                ];

            startupsLastSearchResults = { startupsEmail: email, lastSearchResult };
            res.send(startupsLastSearchResults);
        } else {
            res.send(startupsLastSearchResults);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// my requests
const getMyRequests = async (req, res) => {
    const { email } = req.query;

    // res.send('route ok')

    try {
        // Find the job post by ID
        const startup = await Startup.findOne({ email });

        console.log(startup.talentRequestHistory);
        const { _id, ...talentRequestHistory } = startup.talentRequestHistory.toObject();

        const myRequests = {};
        const requests = Object.values(talentRequestHistory)
            .flatMap((tier) => tier.map((item) => item.searchHistory))
            .flat();

        if (requests.length) {
            myRequests.searchHistory = requests;
        } else {
            myRequests.searchHistory = [];
        }

        //   console.log(searchHistoryArray);

        // console.log(searchHistoryArray);

        const talentRequestPaymentDetails = startup?.talentRequestPaymentDetails;
        const tier = talentRequestPaymentDetails?.tier;
        const transactionId = talentRequestPaymentDetails?.transactionId;
        console.log(tier, transactionId);
        let totalMatch = 0;
        let requestsInCurrentTier = [];

        if (
            startup.talentRequestHistory[tier] &&
            startup.talentRequestHistory[tier][startup.talentRequestHistory[tier]] &&
            startup.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1]
        ) {
            const isValidTransactionId = startup?.talentRequestHistory[tier].find(
                (eachTransaction) => eachTransaction.transactionId === transactionId
            );
            if (isValidTransactionId) {
                totalMatch = startup.talentRequestHistory[tier][
                    startup.talentRequestHistory[tier].length - 1
                ].searchHistory.reduce(
                    (acc, talentHistory) => acc + talentHistory.requiredTalentsInHistory.length,
                    0
                );
                requestsInCurrentTier =
                    startup.talentRequestHistory[tier][
                        startup.talentRequestHistory[tier].length - 1
                    ].searchHistory;
            }

            // const totalMatch = startup.talentRequestHistory[tier].reduce(
            //     (acc, talentHistory) => acc + talentHistory.requiredTalentsInHistory.length,
            //     0
            // );
            // console.log(totalMatch);
            const myRequestData = {
                totalMatch,
                myRequests,
                requestsInCurrentTier,
            };

            // Update the application request's status to "accepted"

            // res.send(job.applicationRequest);
            res.send(myRequestData);
        } else {
            const myRequestData = {
                totalMatch,
                myRequests,
                requestsInCurrentTier,
            };

            res.send(myRequestData);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// request for interview
const interviewRequests = async (req, res) => {
    // const requestBody = {
    //     startupsEmail: 'webewe63fdf82@3mkz.com',
    //     searchId: '64426c076f87207e8f0686b5',
    //     talentsEmail: ['biyimo857r6@dicopto.com', 'aniketsomkuwar1101@gmail.com'],
    //     searchQuery: {
    //         details: {
    //             description: 'sfd',
    //             title: 'sdf',
    //         },
    //         selectedLanguages: ['English'],
    //         locationPreference: ['Remote'],
    //         softSkills: ['Adaptability'],
    //         selectedSkills: [
    //             {
    //                 skillName: 'React',

    //                 level: 'Beginner',
    //             },
    //             {
    //                 skillName: 'HTML',

    //                 level: 'Intermediate',
    //             },
    //         ],
    //         requiredTalents: 24,
    //     },
    //     interviewStatus: 'requested',
    //     tier: 'tierFree',
    //     transactionId: null,
    // };
    const requestBody = req.body;

    try {
        // Find startup user
        const startup = await Startup.findOne({ email: requestBody.startupsEmail });
        const talentRequestPaymentDetails = startup?.talentRequestPaymentDetails;
        const tier = talentRequestPaymentDetails?.tier;
        const transactionId = talentRequestPaymentDetails?.transactionId;

        const eventsProp = startup.talentRequestHistory[tier]
            .find((searchHistory) => searchHistory.transactionId === transactionId)
            .searchHistory.find(
                (search) =>
                    search._id.toString() ===
                    mongoose.Types.ObjectId(requestBody.searchId).toString()
            );
        // console.log({eventsProp});

        if (!eventsProp?.events?.length) {
            eventsProp.events = requestBody.events;

            // eventsProp.events.push(requestBody.events)
        } else {
            requestBody.events.forEach((event) => {
                eventsProp.events.push(event);
            });
        }

        startup.talentRequestHistory[tier]
            .find((searchHistory) => searchHistory.transactionId === transactionId)
            .searchHistory.find(
                (search) =>
                    search._id.toString() ===
                    mongoose.Types.ObjectId(requestBody.searchId).toString()
            )
            .requiredTalentsInHistory.forEach((talent) => {
                if (requestBody.talentsEmail.includes(talent.email)) {
                    talent.interviewStatus = requestBody.interviewStatus;
                }
            });
        startup.talentRequestHistory[tier]
            .find((searchHistory) => searchHistory.transactionId === transactionId)
            .searchHistory.find(
                (search) =>
                    search._id.toString() ===
                    mongoose.Types.ObjectId(requestBody.searchId).toString()
            )
            .requiredTalentsInHistory.forEach((talent) => {
                if (requestBody.talentsEmail.includes(talent.email)) {
                    talent.interviewStatus = requestBody.interviewStatus;
                }
            });

        const remoforce = await Remoforce.find({ email: { $in: requestBody.talentsEmail } });

        const promises = remoforce.map((remo) => {
            console.log('------------', remo.email);

            const remoObject = {
                startupsEmail: requestBody.startupsEmail,
                searchQuery: requestBody.searchQuery,
                interviewStatus: requestBody.interviewStatus,
                jobId: requestBody.searchId,
                startupName: requestBody.startupName,
                startupIcon: requestBody.startupIcon,
                remoforceEmail: remo.email,
                remoforceName: remo.fullName,
            };

            const remoNotificationObject = {
                jobId: requestBody.searchId,
                startupsEmail: requestBody.startupsEmail,
                startupName: requestBody.startupName,
                remoforceEmail: remo.email,
                jobTitle: requestBody.searchQuery.details.title,
                type: requestBody.type,
                stage: requestBody.stage,
                status: requestBody.status,
                remoforceName: remo.fullName,
            };

            if (!remo.allRequests) {
                remo.allRequests = [];
                remo.allRequests.push(remoObject);
            } else {
                const alreadyExist = remo.allRequests.find(
                    (request) => request.jobId === requestBody.searchId
                );
                if (!alreadyExist) {
                    remo.allRequests.push(remoObject);
                }
            }
            if (!remo.notifications) {
                remo.notifications = [];
                remo.notifications.push(remoNotificationObject);
            } else {
                const alreadyExist = remo.notifications.find(
                    (request) =>
                        request.jobId === remoNotificationObject.jobId &&
                        request.type === remoNotificationObject.type &&
                        request.stage === remoNotificationObject.stage
                );
                if (!alreadyExist) {
                    remo.notifications.push(remoNotificationObject);
                }
            }
            return remo.save();
        });

        // console.log(startup);

        await Promise.all(promises);

        const result = await startup.save();
        res.status(200).send({
            message: 'Event creation successful.Pls check your calender',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// job request accept or reject

const remoforceRequestAcceptance = async (req, res) => {
    // const requestBody = {
    //     startupsEmail: 'webewe63fdf82@3mkz.com',
    //     remoforceEmail: 'biyimo857r6@dicopto.com',
    //     jobId: '64426c076f87207e8f0686b5',
    //     interviewStatus: 'accepted',
    // };

    const requestBody = req.body;
    const {
        jobId,
        startupsEmail,
        startupName,
        remoforceEmail,
        jobTitle,
        type,
        stage,
        status,
        remoforceName,
    } = requestBody;
    const startupNotificationObject = {
        jobId,
        startupsEmail,
        startupName,
        remoforceEmail,
        jobTitle,
        type,
        stage,
        status,
        remoforceName,
    };

    // console.log({ requestBody });

    try {
        // Find startup user
        const startup = await Startup.findOne({ email: requestBody.startupsEmail });
        const remoforce = await Remoforce.findOne({ email: requestBody.remoforceEmail });

        const getSearchHistoryById = (id) => {
            const tiers = Object.keys(startup.talentRequestHistory.toObject()).filter(
                (item) => item !== '_id'
            );

            // console.log('------------tier', tiers);
            for (let i = 0; i < tiers.length; i += 1) {
                const tier = startup.talentRequestHistory[tiers[i]];

                for (let j = 0; j < tier.length; j += 1) {
                    const searchHistory = tier[j].searchHistory.find(
                        (history) =>
                            history._id.toString() === mongoose.Types.ObjectId(id).toString()
                    );
                    // console.log(
                    //     `searching for id ${id} in tier ${i}, request ${j}, searchHistory ${searchHistory}`
                    // );
                    if (searchHistory) {
                        return searchHistory;
                    }
                }
            }
            return 'id not found'; // id not found
        };

        const searchHistory = getSearchHistoryById(requestBody.jobId);

        const bookedEvent = searchHistory.events.find(
            (event) => event.meetLink === requestBody.bookedSlot.selectedMeetLink
        );

        // console.log('------------', bookedEvent);

        bookedEvent.slotStatus = requestBody.slotStatus;
        const talentData = searchHistory.requiredTalentsInHistory.find(
            (talent) => talent.email === requestBody.remoforceEmail
        );
        talentData.interviewStatus = requestBody.interviewStatus;
        talentData.interviewSchedule = requestBody.bookedSlot;

        const remoforceRequest = remoforce.allRequests.find(
            (request) => request.jobId === requestBody.jobId
        );
        remoforceRequest.interviewStatus = requestBody.interviewStatus;
        remoforceRequest.interviewSchedule = requestBody.bookedSlot;
        await remoforce.save();

        if (!startup.notifications) {
            startup.notifications = [];
            startup.notifications.push(startupNotificationObject);
        } else {
            const alreadyExist = startup.notifications.find(
                (request) =>
                    request.remoforceEmail === startupNotificationObject.remoforceEmail &&
                    request.jobId === startupNotificationObject.jobId &&
                    request.type === startupNotificationObject.type &&
                    request.stage === startupNotificationObject.stage
            );
            if (!alreadyExist) {
                startup.notifications.push(startupNotificationObject);
            }
        }

        await startup.save();
        res.status(200).send({
            message: 'Interview slot booking successful',
            data: startup.notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
const remoforceRequestRejection = async (req, res) => {
    // const requestBody = {
    //     startupsEmail: 'webewe63fdf82@3mkz.com',
    //     remoforceEmail: 'biyimo857r6@dicopto.com',
    //     jobId: '64426c076f87207e8f0686b5',
    //     interviewStatus: 'accepted',
    // };

    const requestBody = req.body;
    const {
        jobId,
        startupsEmail,
        startupName,
        remoforceEmail,
        jobTitle,
        type,
        stage,
        status,
        remoforceName,
        interviewStatus,
    } = requestBody;
    const startupNotificationObject = {
        jobId,
        startupsEmail,
        startupName,
        remoforceEmail,
        jobTitle,
        type,
        stage,
        status,
        remoforceName,
    };

    // console.log({ requestBody });

    try {
        // Find startup user
        const startup = await Startup.findOne({ email: startupsEmail });
        const remoforce = await Remoforce.findOne({ email: remoforceEmail });

        const getSearchHistoryById = (id) => {
            const tiers = Object.keys(startup.talentRequestHistory.toObject()).filter(
                (item) => item !== '_id'
            );

            console.log('------------tier', tiers);
            for (let i = 0; i < tiers.length; i += 1) {
                const tier = startup.talentRequestHistory[tiers[i]];

                for (let j = 0; j < tier.length; j += 1) {
                    const searchHistory = tier[j].searchHistory.find(
                        (history) =>
                            history._id.toString() === mongoose.Types.ObjectId(id).toString()
                    );
                    // console.log(
                    //     `searching for id ${id} in tier ${i}, request ${j}, searchHistory ${searchHistory}`
                    // );
                    if (searchHistory) {
                        return searchHistory;
                    }
                }
            }
            return 'id not found'; // id not found
        };

        const searchHistory = getSearchHistoryById(jobId);

        console.log({ searchHistory });

        const rejectedRequest = searchHistory.requiredTalentsInHistory.find(
            (talent) => talent.email === remoforceEmail
        );

        rejectedRequest.interviewStatus = interviewStatus;
        await Remoforce.updateOne(
            { email: remoforceEmail },
            { $pull: { notifications: { jobId } } }
        );

        remoforce.allRequests.pull({ jobId });
        await remoforce.save();
        await remoforce.save();

        if (!startup.notifications) {
            startup.notifications = [];
            startup.notifications.push(startupNotificationObject);
        } else {
            const alreadyExist = startup.notifications.find(
                (request) =>
                    request.remoforceEmail === startupNotificationObject.remoforceEmail &&
                    request.jobId === startupNotificationObject.jobId &&
                    request.type === startupNotificationObject.type &&
                    request.stage === startupNotificationObject.stage
            );
            if (!alreadyExist) {
                startup.notifications.push(startupNotificationObject);
            }
        }

        await startup.save();
        res.status(200).send({
            message: 'Interview slot booking successful',
            data: startup.notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
const getAvailableSlots = async (req, res) => {
    const { startupsEmail, jobId } = req.query;
    console.log({ startupsEmail }, { jobId });

    try {
        const startup = await Startup.findOne({ email: startupsEmail });
        const getSearchHistoryById = (id) => {
            const tiers = Object.keys(startup.talentRequestHistory.toObject()).filter(
                (item) => item !== '_id'
            );

            for (let i = 0; i < tiers.length; i += 1) {
                const tier = startup.talentRequestHistory[tiers[i]];

                for (let j = 0; j < tier.length; j += 1) {
                    const searchHistory = tier[j].searchHistory.find(
                        (history) =>
                            history._id.toString() === mongoose.Types.ObjectId(id).toString()
                    );

                    if (searchHistory) {
                        return searchHistory;
                    }
                }
            }
            return 'id not found'; // id not found
        };

        const searchHistory = getSearchHistoryById(jobId);
        const availableSlots = searchHistory.events.filter(
            (event) => event.slotStatus === 'available'
        );
        // console.log('---------', availableSlots);
        res.send(availableSlots);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const createdEvents = async (req, res) => {
    const { email, jobId } = req.query;

    try {
        const startup = await Startup.findOne({ email });
        const getSearchHistoryById = (id) => {
            const tiers = Object.keys(startup.talentRequestHistory.toObject()).filter(
                (item) => item !== '_id'
            );

            for (let i = 0; i < tiers.length; i += 1) {
                const tier = startup.talentRequestHistory[tiers[i]];

                for (let j = 0; j < tier.length; j += 1) {
                    const searchHistory = tier[j].searchHistory.find(
                        (history) =>
                            history._id.toString() === mongoose.Types.ObjectId(id).toString()
                    );

                    if (searchHistory) {
                        return searchHistory;
                    }
                }
            }
            return 'id not found'; // id not found
        };

        const searchHistory = getSearchHistoryById(jobId);
        const { events } = searchHistory;
        // console.log('---------', availableSlots);
        res.send(events);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getStartupsDetail = async (req, res) => {
    const { email } = req.query;

    try {
        const startup = await Startup.findOne(
            { email },
            { startupName: 1, startupIcon: 1, talentRequestPaymentDetails: 1 }
        );

        res.send(startup);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const createPayments = async (req, res) => {
    const { startupEmail, tier, transactionId, searchLimit } = req.body;

    const talentRequestPaymentDetails = { tier, transactionId, searchLimit };

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const [createPayment] = await Payment.create([req.body], { session });
        if (!createPayment) {
            throw new Error('Payment not created');
        }
        talentRequestPaymentDetails.id = createPayment._id;
        const updatedStartup = await Startup.updateOne(
            { email: startupEmail },
            { talentRequestPaymentDetails },
            { upsert: true, new: true, session, timestamps: false }
        );
        if (updatedStartup.modifiedCount === 0) {
            throw new new Error('failed to update startup')();
        }
        await session.commitTransaction();
        await session.endSession();
        res.send(updatedStartup);
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        res.status(500).send(error.message);
    }
};

module.exports = {
    getMatchedTalents,
    getMatchedLastResults,
    getMyRequests,
    interviewRequests,
    remoforceRequestAcceptance,
    getAvailableSlots,
    createdEvents,
    getStartupsDetail,
    remoforceRequestRejection,
    createPayments,
};
