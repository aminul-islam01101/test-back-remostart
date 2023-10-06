const express = require('express');
const superAdminRouter = require('./org.superAdmin.route');
const teamRouter = require('./org.team.route');
const AuthRoutes = require('./org.user.route');

const orgRouter = express.Router();

orgRouter.get('/health', async (req, res) => {
    res.send('org route is ok');
});

const moduleRoutes = [
    {
        path: '/',
        route: AuthRoutes,
    },
    {
        path: '/s-admin',
        route: superAdminRouter,
    },
    {
        path: '/team',
        route: teamRouter,
    },
];

moduleRoutes.forEach((route) => orgRouter.use(route.path, route.route));

module.exports = orgRouter;

/* 
Admin side Features:
Data Analytics
Account Verification 
In-House Job posting 
Register Startup
DEI Request
Remostart Blog
Remostart Team
Queries ( a messaging system between any user and remostart)

Roles and Given Feature Access

Admin - all the features access
Sub Admin -  Account Verification, Register Startup, In-House Job posting, DEI Request
Marketing - Data Analytics, In-House Job posting
Content - Remostart Blog
Customer service - Queries


*/
