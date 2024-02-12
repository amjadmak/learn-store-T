const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { learnerModel, tutorModel, baseUserModel, tokenModel } = require('../models/user');
const { sendEmail } = require('../utility/mail');
//const { getPrivateTutor } = require('./tutorControl');
//const { getLearner } = require('./learnerControl');


const {
    HASH_ROUNDS,
    FOURTEEN_DAYS_MILLISECONDS,
    FOURTEEN_DAYS_STRING,
} = require('../utility/constants');
//const { type } = require('os');


/// we just check __t we do not need the type of user
async function getAccount(req, payload) {
    req.user = payload;
    const currentUser = await baseUserModel.findById(req.user.id);
    let userToReturn;
    if (currentUser.__t === 'tutor') {
        userToReturn = await tutorModel.findById(req.user.id, "-hashedPass");
    } else if (currentUser.__t === 'learner') {
       userToReturn = await learnerModel.findById(req.user.id, "-hashedPass");
    }
    return userToReturn;
}

const accountRegister = async (req, res) => {
try {
        const existedAccount = await baseUserModel.findOne({
            email: req.body.email,
        });
        const existedUsername = await baseUserModel.findOne({
            username: req.body.username,
        });
        if (existedUsername) {
            return res.status(400).json({ message: 'Username is already used' });
        }

        if (existedAccount ) {
            return res.status(400).json({ message: 'Email is already used' });
        }
        errorsArray.push("email");
        const hashedPass = await bcrypt.hash(
            req.body.password,
            HASH_ROUNDS
        );
        errorsArray.push("hashpass");
        let  newBaseUser = null;

        if (req.path === '/tutorRegister') {
            newBaseUser = await new tutorModel({
                email: req.body.email,
                hashedPass,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                phone: req.body.phone,
                edu_Certificates: req.body.fieldOfStudy,
                experience: req.body.fieldOfStudy,


            }).save();
        }

      
         else if (req.path === '/learnerRegister') {
            newBaseUser = await new learnerModel({
                email: req.body.email,
                hashedPass,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                phone: req.body.phone,
                fieldOfStudy: req.body.fieldOfStudy,
                educationYear: req.body.educationYear,
            }).save();
        }


 const payload = {
            _id: newBaseUser.id,
            email: newBaseUser.email,
            username: newBaseUser.username,
            fullName: newBaseUser.firstName + ' ' + newBaseUser.lastName,
            type: newBaseUser.__t,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: FOURTEEN_DAYS_STRING,
        });

        res.cookie('auth_token', token, {
            httpOnly: true,
            signed: true,
            expires: new Date(Date.now() + FOURTEEN_DAYS_MILLISECONDS),
            secure: process.env.DEPLOYED === 'yes',
            sameSite: 'none',
        });

        const verificationToken = await new tokenModel({
            userId: newBaseUser.id,
            token: crypto.randomBytes(32).toString('hex'),
        }).save();

        await sendEmail(newBaseUser, verificationToken);
        errorsArray.push("email");


        const userToReturn = payload;
        return res.status(200).json({
            message:
                'You have successfully signed up and a verification email sent',
            user: userToReturn,
        });
     
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error while creating the account'});
    }
}


const verifyAccountEmail = async (req, res) => {
    try {
        const baseUserAccount = await baseUserModel.findOne({
            _id: req.params.id,
        });

        if (!baseUserAccount) {
            return res.status(400).json({ message: 'Invalid link' });
        }

        if (baseUserAccount.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const token = await tokenModel.findOne({
            userId: baseUserAccount.id,
            token: req.params.token,
        });

        if (!token) {
            return res.status(400).json({ message: 'Invalid link' });
        }

        await baseUserModel.updateOne({ _id: baseUserAccount.id }, { isVerified: true });
       // await tokenModel.findByIdAndDelete(token.id);  // was changed to delete all the tokens for the user
        await tokenModel.deleteMany({ userId: baseUserAccount.id });

        return res.status(200).json({ message: 'User verified' });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).json({ error: 'Internal server error while verifying the email' });
    }
}

const resendVerificationEmail = async (req, res) => {
    const { id } = req.body;

    try {
        // Find the user by email
        const user = await baseUserModel.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        // Generate a new verification token (similar to what you do during registration)
        const verificationToken = await new tokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        }).save();

        // Send the verification email
        await sendEmail(user, verificationToken);

        res.status(200).json({ message: "Verification email resent" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while resending the verification email"});
    }
}

const login = async (req, res) => {
    try {
        const baseUserAccount = await baseUserModel.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if (!baseUserAccount) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });
        }
        if(req.signedCookies.auth_token ?? req.cookies.auth_token){
            return res.status(400).json({ message: `You are already logged in as \'${baseUserAccount.username}\' Please logout if you want to login as a different user` });
        }
        const isPasswordValid = bcrypt.compare(
            req.body.password,
            baseUserAccount.hashedPass
        );
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });
        }
        // create token
        const payload = {
            id: baseUserAccount.id,
            email: baseUserAccount.email,
            fullName: baseUserAccount.fullName,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: FOURTEEN_DAYS_STRING,
        });

        // set cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            signed: true,
            expires: new Date(Date.now() + FOURTEEN_DAYS_MILLISECONDS),
            secure: process.env.DEPLOYED === 'yes',
            sameSite: 'none',
        });

        const result = {};
        if (!baseUserAccount.isVerified) {
            result.warning = 'Please verify your email, Account is not verified';
        }
        result.message = 'User signed in';
        result.user = await getAccount(req, payload);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error while logging in' });
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie('auth_token');
        return res.status(200).json({ message: 'User signed out' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error while logging out' });
    }
}

const registerGoogleUser = async (req, res) => {
    const googleId = `google-${req.user._json.sub}`;

    let user = await baseUserModel.findOne({ providerId: googleId });

    if (!user) {
        user = await baseUserModel.create({
            email: req.user._json.email,
            firstName: req.user._json.given_name,
            lastName: req.user._json.family_name,
            provider: 'google',
            providerId: googleId,
            isVerified: true,
        });
    }

    const payload = {
        id: user.id,
        email: user.email,
        fullName: user.firstName + ' ' + user.lastName,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: FOURTEEN_DAYS_STRING,
    });

    res.cookie('auth_token', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + FOURTEEN_DAYS_MILLISECONDS),
        secure: process.env.DEPLOYED === 'yes',
        sameSite: 'none',
    });

    const userToReturn = await getAccount(req, payload);

    res.status(200).json({
        message: 'User successfully signed in',
        user: userToReturn,
    });
}

module.exports = {
    accountRegister,
    verifyAccountEmail,
    resendVerificationEmail,
    login,
    logout,
    registerGoogleUser,
}