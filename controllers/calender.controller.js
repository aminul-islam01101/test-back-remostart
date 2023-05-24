const { google } = require('googleapis');
const axios = require('axios');

require('dotenv').config();

const { OAuth2 } = google.auth;
const Startup = require('../models/startup.schema');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const { GOOGLE_REFRESH_TOKEN } = process.env;
const REDIRECT_URI = `${process.env.SERVER_ROOT}/calender/google/redirect`;
const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
];
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
    const { tokens } = await oauth2Client.refreshToken(refreshToken);
    return tokens.access_token;
};

async function isAccessTokenExpired(accessToken) {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
        );

        const expirationTime = Date.now() + response.data.expires_in * 1000;
        return Date.now() >= expirationTime;
    } catch (error) {
        console.error('Invalid token');
        return true;
    }
}

const getRedirect = async (req, res) => {
    const { code, state } = req.query;
    const { email, id, job } = JSON.parse(state);

    const { tokens } = await oauth2Client.getToken(code);
    // oauth2Client.setCredentials(tokens);
    // console.log(tokens.access_token);
    // oauth2Client.setCredentials({ access_token: tokens.access_token });

    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const expirationDate = tokens.expiry_date;
    console.log({ accessToken}, {refreshToken });

    if (refreshToken) {
        await Startup.findOneAndUpdate(
            { email },
            { calenderTokens: { accessToken, refreshToken } },
            { upsert: true }
        );
    }
    else{
        await Startup.findOneAndUpdate(
            { email },
            { calenderTokens: { accessToken } },
            { upsert: true }
        );
    
    }

  
    let redirectUrl = '';
    if (id && job) {
        redirectUrl = `${process.env.CLIENT}/dashboard/${job}/${id}/view-applicants`;
    } else {
        redirectUrl = `${process.env.CLIENT}/dashboard/talent-request`;
    }
    console.log({redirectUrl});
    

    // const redirectUrl = `${process.env.CLIENT}/dashboard/talent-request`;

    // res.cookie(tokens.access_token);
    // const redirectUrl = `${n}?aT=${accessToken}`;
    res.redirect(redirectUrl);
};
// const applicantCalenderRedirect = async (req, res) => {
//     const { code, state } = req.query;
//     const { email, id, job } = JSON.parse(state);
//     console.log('-------', { email }, { id }, job);

//     const { tokens } = await oauth2Client.getToken(code);
//     // oauth2Client.setCredentials(tokens);
//     // console.log(tokens.access_token);
//     // oauth2Client.setCredentials({ access_token: tokens.access_token });

//     const accessToken = tokens.access_token;
//     const refreshToken = tokens.refresh_token;
//     const expirationDate = tokens.expiry_date;
//    // console.log({ accessToken, refreshToken, expirationDate });

//     await Startup.findOneAndUpdate(
//         { email },
//         { calenderTokens: { accessToken, refreshToken } },
//         { upsert: true }
//     );
//     let redirectUrl = '';
//     if (id && job) {
//         redirectUrl = `${process.env.CLIENT}/dashboard/${job}/${id}/view-applicants`;
//     } else {
//         redirectUrl = `${process.env.CLIENT}/dashboard/talent-request`;
//     }
//     console.log({redirectUrl});
    

//     // res.cookie(tokens.access_token);
//     // const redirectUrl = `${n}?aT=${accessToken}`;
//     res.redirect(redirectUrl);
// };
// console.log('--------------', 'oauth2Client:', oauth2Client);

// create event
const createEvent = async (req, res) => {
    const { startTime, endTime, timeZone, email } = req.body;

    const startupUser = await Startup.findOne({ email });
    let { accessToken } = startupUser.calenderTokens;
    const { refreshToken } = startupUser.calenderTokens;

    const isExpired = await isAccessTokenExpired(accessToken);

    if (!accessToken || isExpired) {
        accessToken = await refreshAccessToken(refreshToken);
        startupUser.calenderTokens.accessToken = accessToken;
        await startupUser.save();
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    // oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // Get list of calendars
    const calendarList = await calendar.calendarList.list({
        minAccessRole: 'owner',
        showDeleted: false,
        showHidden: false,
        mine: true,
    });

    // Find the calendar with the same primary email as the authenticated user
    const calendarId = calendarList.data.items.find((item) => item.primary).id;

    const event = {
        summary: 'interview schedule',
        description: 'This is a meeting with a Google Meet link',
        start: {
            dateTime: new Date(startTime),
            timeZone,
        },
        end: {
            dateTime: new Date(endTime),
            timeZone,
        },
        //
        conferenceData: {
            createRequest: {
                requestId: Math.random().toString(36).substring(7),
                conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                },
                // entryPoints: [
                //     {
                //     entryPointType: "video",

                //       accessCode: "1234",
                //       status: {
                //         statusCode: "guestNotAllowed"
                //       }
                //     }
                //   ]
            },
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId,
            auth: oauth2Client,
            requestBody: event,
            conferenceDataVersion: 1,
            sendNotifications: true,
        });
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const    createApplicantEvent = async (req, res) => {
    const { startTime, endTime, timeZone, email,applicantsEmail } = req.body;

    const startupUser = await Startup.findOne({ email });
    let { accessToken } = startupUser.calenderTokens;
    const { refreshToken } = startupUser.calenderTokens;

    const isExpired = await isAccessTokenExpired(accessToken);

    if (!accessToken || isExpired) {
        accessToken = await refreshAccessToken(refreshToken);
        startupUser.calenderTokens.accessToken = accessToken;
        await startupUser.save();
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    // oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // Get list of calendars
    const calendarList = await calendar.calendarList.list({
        minAccessRole: 'owner',
        showDeleted: false,
        showHidden: false,
        mine: true,
    });

    // Find the calendar with the same primary email as the authenticated user
    const calendarId = calendarList.data.items.find((item) => item.primary).id;

    const event = {
        summary: 'interview schedule',
        description: 'This is a meeting with a Google Meet link',
        start: {
            dateTime: new Date(startTime),
            timeZone,
        },
        end: {
            dateTime: new Date(endTime),
            timeZone,
        },
         attendees: [
            {
              email,
              responseStatus: "accepted",
              organizer: true,
            },
            { email: applicantsEmail},
          ],
          guestsCanSeeOtherGuests: false,
        conferenceData: {
            createRequest: {
                requestId: Math.random().toString(36).substring(7),
                conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                },
                // entryPoints: [
                //     {
                //     entryPointType: "video",

                //       accessCode: "1234",
                //       status: {
                //         statusCode: "guestNotAllowed"
                //       }
                //     }
                //   ]
            },
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId,
            auth: oauth2Client,
            requestBody: event,
            conferenceDataVersion: 1,
            sendNotifications: true,
        });
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const getAccess = async (req, res) => {
    const email = req.originalUrl.split('/').pop();

    // console.log({reqUrl});

    // const email ='something'
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: JSON.stringify({ email }),
    });

    res.redirect(url);
};
const applicantCalenderAccess = async (req, res) => {
    const urlArr = req.originalUrl.split('/');
    const job = urlArr[urlArr.length - 3];
    const id = urlArr[urlArr.length - 2];

    const email = urlArr[urlArr.length - 1];

    console.log({ email }, { id }, { job });

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: JSON.stringify({ email, id, job }),
    });

    res.redirect(url);
    // console.log(email);
};
const gotAccess = async (req, res) => {
    const { email } = req.params;
    const startupUser = await Startup.findOne({ email });
    if (startupUser.calenderTokens.accessToken) {
        res.send(true);
        return;
    }

    res.send(false);
};

module.exports = {
    createEvent,
    getAccess,
    gotAccess,
    getRedirect,
    applicantCalenderAccess,
    createApplicantEvent

};
