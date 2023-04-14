const Remoforce = require('../models/remoForce.schema');
const Startup = require('../models/startup.schema');

const getMatchedTalents = async (req, res) => {
    const queryData = {
        email: 'webewe63fdf82@3mkz.com',
        tier: 'Free',
        transactionId: null,
        details: { description: 'something', title: 'title' },
        selectedLanguages: ['English', 'Spanish'],
        locationPreference: 'Remote',
        softSkills: ['Active listening', 'Adaptability'],
        selectedSkills: [
            { skillName: 'JavaScript', level: 'Beginner' },
            // { skillName: 'Python', level: 'Pro' },
            { skillName: 'Java', level: 'Beginner' },
            { skillName: 'Rust', level: 'Beginner' },
        ],
        requiredTalents: 2,
    };

    try {
        const docs = await Remoforce.find({
            $or: [
                { 'selectedLanguages.language': { $in: queryData.selectedLanguages } },
                { softSkills: { $all: queryData.softSkills } },
                { selectedSkills: { $elemMatch: { $or: queryData.selectedSkills } } },
                { 'jobPreference.locationPreference': queryData.locationPreference },
            ],
        });

        const results = [];

        docs.forEach((doc) => {
            let score = 0;

            if (
                doc.jobPreference &&
                doc.jobPreference.locationPreference === queryData.locationPreference
            ) {
                score += 100;
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
            const talentScoreFilter = results.filter((talent) => talent.scorePercentage >= 50);
            if (talentScoreFilter.length >= queryData.requiredTalents) {
                sortedTalent = talentScoreFilter.slice(0, queryData.requiredTalents);
            } else {
                sortedTalent = talentScoreFilter;
            }
        }
        const requiredTalentsInHistory = sortedTalent.map((talent) => ({
            email: talent.email,
            fullName: talent.fullName,
            scorePercentage: talent.scorePercentage,
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
        const maxSearchLimit ={
            tierFree:2,
            tier10:15,
            tier15:20,

        } ;
        
        

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

        // console.log(results);
        res.send(startupUser.talentRequestHistory);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

module.exports = {
    getMatchedTalents,
};
