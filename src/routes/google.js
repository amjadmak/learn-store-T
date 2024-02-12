const express = require('express');
const authControl = require('../controllers/authControl');
const { passport } = require('../config/passport');

const router = express.Router();
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email', 'openid'],
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/google/google-auth',
        successRedirect:
            process.env.DEPLOYED === 'yes'
                ? 'https://pebble-proj.netlify.app/' // production  CHANGE!!!!!!!
                : 'http://localhost:3000/', // development CHANGE!!!!!!!!
        session: false,
    }),
    authControl.registerGoogleUser
);

module.exports = router;
