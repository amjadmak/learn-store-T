require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { learnerModel } = require("../models/user");
const { tutorModel } = require("../models/user");
const { sendEmail, generateUniqeUsername } = require('../utility/mail');
// WE CAN USE _T PROPERTY TO DETERMINE THE USER TYPE
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const learner = await learnerModel.findById(id);
  if (learner) {
    done(null, learner);
  } else {
    const tutor = await tutorModel.findById(id);
    if (tutor) {
      done(null, tutor);
    } else {
      done(new Error("User not found"));
    }
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,  //this one should be handled in the end
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const userType = profile.__t;
        let user;
        if (userType === "learner") {
          user = await learnerModel.findOne({ googleId: `google-${profile.id}` });
          if (!user) {
              user = await user.create({
              email: profile.emails[0].value,
              username: generateUniqeUsername(profile.emails[0].value),
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
            //  profilePhoto: profile.photos[0].value,  //PHOTO TO BE ADDED LATERRRR
              provider: "Google",
              providerId: `google-${profile.id}`,
            });
          }
        } else if (userType === "tutor") {
          user = await tutorModel.findOne({ googleId: `google-${profile.id}` });
          if (!user) {
            user = await user.create({
              email: profile.emails[0].value,
              username: generateUniqeUsername(profile.emails[0].value),
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profilePhoto: profile.photos[0].value,
              provider: "Google",
              providerId: `google-${profile.id}`,
            });
          }
        }

        await sendEmail(
user,
null
        );

        cb(null, user);
      } catch (err) {
        cb(err, null);
      }
    }
  )
);
module.exports = {
  passport,
};
