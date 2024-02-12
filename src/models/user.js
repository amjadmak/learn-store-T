const mongoose = require("mongoose");
const constants = require("../utility/constants");
const objectId = mongoose.Schema.Types.ObjectId;


const tokenSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'baseUser',
      required: true,
  },
  token: {
      type: String,
      required: true,
  },
});

const addressSchema = new mongoose.Schema({
  Country: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Street1: {
    type: String,
    required: false,
  },
  Street2: {
    type: String,
    required: false,
  },
  ZipCode: {
    type: String,
    required: false,
    match: [
      /^\d{5}(?:[-\s]\d{4})?$/,
      `Zip code must be in the format 12345 or 12345-1234`,
    ],
  },
});
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  finishedAt: {
    type: Date,
    required: false,
  },
  isPresent: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const edu_CertificatesSchema = new mongoose.Schema({
  doc_no: {
    type: String,
    required: false,
  },
  isEducation: {
    type: Boolean,
    required: true,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  startAt: {
    type: Date,
    required: true,
  },
  finishedAt: {
    type: Date,
    required: false,
  },
  isPresent: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const tutorSchema = new mongoose.Schema({
  experience: {
    type: [experienceSchema],
    required: false,
    default: [],
  },
  edu_Certificates: {

    type: [edu_CertificatesSchema],
   required: false,
    default: [],
  },
});

const learnerSchema = new mongoose.Schema({
  fieldOfStudy: {
    type: String,
    required: false,
  },
  educationYear: {
    type: String,
    enum: constants.EDUCATIONAL_YEAR,
    required: false,
  },
});

const baseUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      required: false,
     // default: constants.DEFAULT_IMAGE,
    }, //ADD THE DEFAULT IMAGE LATER.
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    posts: {
      posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }],
      default: [],
    },
    address: {
      type: [addressSchema],
      default: [],
    },

    hashedPass: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["email", "google", "facebook"],
      default: "email",
      required: true,
    },
    providerId: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const baseUserModel = mongoose.model("base-user", baseUserSchema);
const tutorModel = baseUserModel.discriminator("tutor", tutorSchema);
const learnerModel = baseUserModel.discriminator("learner", learnerSchema);
const tokenModel = mongoose.model("token", tokenSchema);

module.exports = { baseUserModel, tutorModel, learnerModel, tokenModel };
