const { body, validationResult, param } = require("express-validator");
const constants = require("../utility/constants");
const { tutorModel, learnerModel, baseUserModel } = require("../models/user");
const { validate } = require("../models/post");

const LoginMiddleWare = [
  body("usernameOrEmail")
    .exists({ checkFalsy: true })
    .withMessage("Please enter your username or email"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password cannot be empty!"),
];

const verifyValidationRules = [
  param('id')
      .exists()
      .isString()
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('A valid id is required'),
  param('token').exists().isString().withMessage('token is required'),
];

const errorHandlingForValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  return next();
};

const RegisterMiddleware = async (req, res, next) => {
  try {
    const errorsArray = [];
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      rePassword,
    } = req.body;

    if (password !== rePassword) {
      errorsArray.push("Password fields do not match");
    }

    if (!constants.PASSWORD_REGEX.test(password)) {
      errorsArray.push(constants.PASSWORD_ERROR);
    }

    if (!constants.USERNAME_REGEX.test(username)) {
      errorsArray.push("Username must be between 2 and 20 characters");
    }
    if (
      !constants.NAME_REGEX.test(firstName) ||
      !constants.NAME_REGEX.test(lastName) ||
      !constants.NAME_REGEX.test(username)
    ) {
      errorsArray.push("Name fields can not be empty");
    }

    if (!constants.EMAIL_REGEX.test(email)) {
      errorsArray.push("Invalid email format");
    }

    if (!constants.PHONE_REGEX.test(phone)) {
      errorsArray.push(
        "The Phone Number has to be in the Format: +123-1234567890"
      );
    }

    if (errorsArray.length > 0) {
      return res.status(400).json({ error: errorsArray});
    }
  } catch (error) {
   
    return res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }

   await next();
};

const validatePassword = async (req, res, next) => {
  const { currentPassword, password, passwordConfirmation } = req.body;
  const errorsArray = [];
  const User = await UserModel.findById(req.user.userId);
  if (currentPassword && password && passwordConfirmation) {
    if (User) {
      const passwordMatch = await bcrypt.compare(
        req.body.currentPassword,
        User.passwordHash
      );
      if (!passwordMatch) {
        errorsArray.push('Old password is incorrect');
      }
    }
    if (password !== passwordConfirmation) {
      errorsArray.push('Passwords do not match');
    }
    if (!constants.PASSWORD_REGEX.test(password)) {
      errorsArray.push(constants.PASSWORD_ERROR);
    }
  } else {
    errorsArray.push('Password fields are required');
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  next();
};

const validateUpdate = async (req, res, next) => {
  const { age, phoneNumber, username } = req.body;
  const errorsArray = [];
  if (username) {
    const similarUsername = await tutorModel.findOne({ username });
    if (similarUsername) {
      errorsArray.push('Username is already taken');
    }
    if (!constants.USERNAME_REGEX.test(username)) {
      errorsArray.push(constants.USERNAME_ERROR);
    }
  }
  if (phoneNumber) {
    const similarPhone = await UserModel.findOne({ phoneNumber });
    if (similarPhone) {
      errorsArray.push('PhoneNumber is already taken');
    }
    if (!constants.PHONE_NUMBER_REGEX.test(phoneNumber)) {
      errorsArray.push(constants.PHONE_NUMBER_ERROR);
    }
  }
  if (age) {
    if (!constants.AGE_REGEX.test(age)) {
      errorsArray.push('Please enter a 2-digit age');
    }
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  next();
};

const validateAddress = async (req, res, next) => {
  const { address } = req.body;
  const requiredFeilds = constants.ADDRESS_REQUIRED_FIELDS;
  const errorsArray = [];
  const operations = ['add', 'update', 'delete'];
  if (!req.params.operation || !operations.includes(req.params.operation)) {
    return res.status(400).json({ error: 'Invalid operation' });
  }
  if (address) {
    if (typeof address !== 'object') {
      errorsArray.push('Address is not an object');
    }
    for (const field of requiredFeilds) {
      if (!address[field]) {
        errorsArray.push(`${field} is required`);
      }
    }
    if (address.zip) {
      if (!constants.ZIP_REGEX.test(address.zip)) {
        errorsArray.push('Zip code is not valid');
      }
    }
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  next();
};

const validateEduAndExp = async (req, res, next) => {
  const { education, experience } = req.body;
  const requiredFeilds = constants.EDU_AND_EXP_REQUIRED_FIELDS;
  const errorsArray = [];
  const operations = ['add', 'update', 'delete'];
  if (!req.params.operation || !operations.includes(req.params.operation)) {
    return res.status(400).json({ error: 'Invalid operation' });
  }
  if (!education && !experience) {
    errorsArray.push('Education or Experince is required');
  }
  if (education || experience) {
    if (typeof education !== 'object') {
      errorsArray.push('Education or Experince need to be an object');

      for (const field of requiredFeilds) {
        if (!education[field]) {
          errorsArray.push(`${field} is required`);
        }
      }


    }
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
    next();
  }

  const validatePost = async (req, res, next) => {
    const { title, description, price } = req.body;
    const errorsArray = [];
    if (!title || !description || !price) {
      errorsArray.push('All fields are required');
    }
    if (title) {
      if (!constants.TITLE_REGEX.test(title)) {
        errorsArray.push('Title must be between 2 and 50 characters');
      }
    }
    if (price) {
      if (!constants.PRICE_REGEX.test(price)) {
        errorsArray.push('Price must be a number');
      }
    }
    if (errorsArray.length > 0) {
      return res.status(400).json({ error: errorsArray });
    }
    next();
  };

module.exports = {
  RegisterMiddleware,
  validatePost,
  LoginMiddleWare,
  errorHandlingForValidation,
  validatePassword,
  validateUpdate,
  validateAddress,
  validateEduAndExp,
  verifyValidationRules,
};
