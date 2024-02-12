const bcrypt = require('bcrypt');
const {learnerModel, baseUserModel} = require('../models/user');
const post = require('../models/post');
const constants = require('../utility/constants.js');

function getFileExtension(fileName) {
  return fileName.split('.').pop();
}


const getLearner = async (req, res) => {

    try {
      if (req.user) {
        
        const currentLearner = await learnerModel.findById(req.user.id, "-hashedPass");
        return res
          .setHeader('Content-Type', 'application/json')
          .status(200)
          .json(currentLearner);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const updateLearner = async (req, res) => {
    try {
      const { firstName, lastName, email, phone, username, fieldOfStudy, educationYear  } = req.body;
      const learner = await learnerModel.findById(req.user.id);
     const profileImage = req.file

      if (!learner) {
        return res.status(403).json({ message: 'Not Authorized' });
      }
      if (learner) {
        if (email) {
          const existingLearner = await baseUserModel.findOne({
              email: email,
          });
          if (existingLearner) {
              return res.status(400).json({ message: 'Email already used' });
          }
      }
      if (username) {
          const existingLearner = await baseUserModel.findOne({
              username: username,
          });
          if (existingLearner) {
              return res.status(400).json({ message: 'Username already used' });
          }
      }
        learner.firstName = firstName;
        learner.lastName = lastName;
        learner.email = email;
        learner.phone = phone;
        learner.username = username;
        learner.fieldOfStudy = fieldOfStudy;
        learner.educationYear = educationYear;
        learner.posts = posts;
        
        const updateUser = await learnerModel.findByIdAndUpdate(req.user.id, learner, {
          new: true,
      }).select('-hashedPass -provider -providerId -isVerified');
        if (profileImage) {
          const imgUrl = await storage.uploadImage(
              profileImage, 
              `${constants.PROFILE_IMAGE_DIR}/${
                learner.id
              }.${getFileExtension(profileImage.originalname)}`
          );
          updateUser.profileImage = imgUrl;
      }
        await learner.save();
        return res.status(200).json({ message: 'Learner updated successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    const deleteLearner = async (req, res) => {
        try {
          const learner = await learnerModel.findById(req.user.id);
          const baseUser = await baseUserModel.findById(req.user.id);
          if (learner && baseUser) {
            await baseUser.delete();
            await learner.delete();
            return res.status(200).json({ message: 'Learner deleted successfully' });
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      }

        const updatePassword = async (req, res) => { //put middleware for password validation
            try {
              const { password, newPassword } = req.body;
              const learner = await learnerModel.findById(req.user.id);
              if (learner) {
                const isMatch = await bcrypt.compare(password, learner.hashedPass);
                if (isMatch) {
                  learner.hashedPass = await bcrypt.hash(newPassword, 10);
                  await learner.save();
                  return res.status(200).json({ message: 'Password updated successfully' });
                } else {
                  return res.status(401).json({ message: 'Incorrect password' });
                }
              }
            } catch (error) {
              return res.status(500).json({ message: error.message });
            }
          }
const updateAddress = async (req, res) => {
  try {
    const { operation } = req.params; 
    const { address } = req.body;
    const learner = await learnerModel.findById(req.user.id);
    if (learner) {
      if (operation === 'add') {
        learner.address.push(address);
        await learner.save();
        return res.status(200).json({ message: 'Address added successfully' });
      } else if (operation === 'update') {

        learner.address = []
        learner.address.push(address)
        await learner.save()
        return res.status(200).json({ message: 'Address updated successfully' });
      }
      else if (operation === "delete"){
          learner.address = []
          await learner.save()
          return res.status(200).json({ message: 'Address deleted successfully' });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getLearner,
    updateLearner,
    deleteLearner,
    updateAddress,
    updatePassword,
}
