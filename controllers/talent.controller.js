/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const Remoforce = require('../models/remoForce.schema');
const Startup = require('../models/startup.schema');

const getMatchedTalents = async (req, res) => {
    const queryData = req.body;
    // console.log(data);

    // const queryData = {
    //     email: 'webewe63fdf82@3mkz.com',
    //     tier: 'Free',
    //     transactionId: null,
    //     details: { description: 'something', title: 'title' },
    //     selectedLanguages: ['English', 'Spanish'],
    //     locationPreference: ['Bangladesh'],
    //     softSkills: ['Active listening', 'Adaptability'],
    //     selectedSkills: [
    //         { skillName: 'JavaScript', level: 'Beginner' },
    //         // { skillName: 'Python', level: 'Pro' },
    //         { skillName: 'Java', level: 'Beginner' },
    //         { skillName: 'Rust', level: 'Beginner' },
    //     ],
    //     requiredTalents: 10,
    // };

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
        const tier = `tier${queryData.tier}`;
        const maxSearchLimit = {
            tierFree: 2,
            tier10: 15,
            tier15: 20,
        };

        if (!startupUser.talentRequestHistory) {
            startupUser.talentRequestHistory = {};
        }

        if (!startupUser.talentRequestHistory[tier]) {
            startupUser.talentRequestHistory[tier] = [];
        }

        const tierHistory = startupUser.talentRequestHistory[tier];

        const matchedTransactionIndex = tierHistory.findIndex(
            (history) => history.transactionId === queryData.transactionId
        );

        // if (matchedTransactionIndex >= 0) {
        //     const history = tierHistory[matchedTransactionIndex];
        //     if (history.searchHistory.length < maxSearchLimit[tier]) {
        //         history.searchHistory.push(talentHistory);
        //     }
        // } else {
        //     const newTransactionHistory = {
        //         transactionId: queryData.transactionId,
        //         searchHistory: [talentHistory],
        //     };
        //     tierHistory.push(newTransactionHistory);
        // }

        if (matchedTransactionIndex >= 0) {
            tierHistory[matchedTransactionIndex].searchHistory.push(talentHistory);
        } else {
            const newTransactionHistory = {
                transactionId: queryData.transactionId,
                searchHistory: [talentHistory],
            };
            tierHistory.push(newTransactionHistory);
        }
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
    const { email, tier } = req.query;

    console.log(email, tier);
    // res.send('route ok')

    try {
        // Find the job post by ID
        const startup = await Startup.findOne({ email });
        if (startup.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1]) {
            const lastSearchResult =
                startup.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1]
                    ?.searchHistory[
                    startup.talentRequestHistory[tier][
                        startup.talentRequestHistory[tier].length - 1
                    ].searchHistory.length - 1
                ];

            const startupsLastSearchResults = { startupsEmail: email, lastSearchResult };
            res.send(startupsLastSearchResults);
        } else {
            const lastSearchResult = {};
            const startupsLastSearchResults = { startupsEmail: email, lastSearchResult };
            res.send(startupsLastSearchResults);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// my requests
const getMyRequests = async (req, res) => {
    const { email, tier } = req.query;

    console.log(email, tier);
    // res.send('route ok')

    try {
        // Find the job post by ID
        const startup = await Startup.findOne({ email });
        // console.log('--------', startup.talentRequestHistory);

        if (startup.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1]) {
            const myRequests =
                startup.talentRequestHistory[tier][startup.talentRequestHistory[tier].length - 1];
            const totalMatch = startup.talentRequestHistory[tier][
                startup.talentRequestHistory[tier].length - 1
            ].searchHistory.reduce(
                (acc, talentHistory) => acc + talentHistory.requiredTalentsInHistory.length,
                0
            );

            // const totalMatch = startup.talentRequestHistory[tier].reduce(
            //     (acc, talentHistory) => acc + talentHistory.requiredTalentsInHistory.length,
            //     0
            // );
            // console.log(totalMatch);
            const myRequestData = {
                totalMatch,
                myRequests,
            };

            // Update the application request's status to "accepted"

            // res.send(job.applicationRequest);
            res.send(myRequestData);
        } else {
            const totalMatch = 0;
            const myRequests = {};
            const myRequestData = {
                totalMatch,
                myRequests,
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

        const eventsProp = startup.talentRequestHistory[requestBody.tier]
            .find((searchHistory) => searchHistory.transactionId === requestBody.transactionId)
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

        startup.talentRequestHistory[requestBody.tier]
            .find((searchHistory) => searchHistory.transactionId === requestBody.transactionId)
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
        startup.talentRequestHistory[requestBody.tier]
            .find((searchHistory) => searchHistory.transactionId === requestBody.transactionId)
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
            console.log('------------' ,remo.email);
            
            const remoObject = {
                startupsEmail: requestBody.startupsEmail,
                searchQuery: requestBody.searchQuery,
                interviewStatus: requestBody.interviewStatus,
                jobId: requestBody.searchId,
                startupName: requestBody.startupName,
                startupIcon: requestBody.startupIcon,
                remoforceEmail:remo.email
            };
            console.log({remoObject});
            
            
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
            return remo.save();
        });

        // console.log(startup);

        await Promise.all(promises);

        const result = await startup.save();
        res.status(200).json({ message: 'Startup saved successfully' });
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

    console.log({ requestBody });

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
const talentData= searchHistory.requiredTalentsInHistory.find(
    (talent) => talent.email === requestBody.remoforceEmail
)
talentData.interviewStatus = requestBody.interviewStatus;
talentData.interviewSchedule = requestBody.bookedSlot;
        await startup.save();

        const remoforceRequest = remoforce.allRequests.find(
            (request) => request.jobId === requestBody.jobId
        );
        remoforceRequest.interviewStatus = requestBody.interviewStatus;
        remoforceRequest.interviewSchedule = requestBody.bookedSlot;
        await remoforce.save();

        res.status(200).json({ message: 'schedule booked' });
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

const  getStartupsDetail= async (req, res) => {
    const { email } = req.query;
   

    try {
        const startup = await Startup.findOne({ email});
      
        res.send(startup);
    } catch (error) {
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
    getStartupsDetail
};
