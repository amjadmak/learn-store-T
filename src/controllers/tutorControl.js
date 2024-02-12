const bcrypt = require('bcrypt');
const {tutorModel, baseUserModel} = require('../models/user');
const post = require('../models/post');
const constants = require('../utility/constants.js');

function getFileExtension(fileName) {
  return fileName.split('.').pop();
}


const getTutor = async (req, res) => {

    try {
      if (req.user) {
        const currentTutor = await tutorModel.findById(req.user.id, "-hashedPass");
        return res
          .setHeader('Content-Type', 'application/json')
          .status(200)
          .json(currentTutor);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  };

  const updateTutor = async (req, res) => {
    try {
      const { firstName, lastName, email, phone, username, posts } = req.body;
      const tutor = await tutorModel.findById(req.user.id);
     const profileImage = req.file

      if (!tutor) {
        return res.status(403).json({ message: 'Not Authorized' });
      }
      if (tutor) {
        if (email) {
          const existingTutor = await baseUserModel.findOne({
              email: email,
          });
          if (existingTutor) {
              return res.status(400).json({ message: 'Email already used' });
          }
      }
      if (username) {
          const existingTutor = await baseUserModel.findOne({
              username: username,
          });
          if (existingTutor) {
              return res.status(400).json({ message: 'Username already used' });
          }
      }
        tutor.firstName = firstName;
        tutor.lastName = lastName;
        tutor.email = email;
        tutor.phone = phone;
        tutor.username = username;
        tutor.posts = posts;
        
        const updateUser = await tutorModel.findByIdAndUpdate(req.user.id, tutor, {
          new: true,
      }).select('-hashedPass -provider -providerId -isVerified');
        if (profileImage) {
          const imgUrl = await storage.uploadImage(
              profileImage, 
              `${constants.PROFILE_IMAGE_DIR}/${
                tutor.id
              }.${getFileExtension(profileImage.originalname)}`
          );
          updateUser.profileImage = imgUrl;
      }
        await tutor.save();
        return res.status(200).json({ message: 'Tutor updated successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    const deleteTutor = async (req, res) => {
        try {
          const tutor = await tutorModel.findById(req.params.id);
          const baseUser = await baseUserModel.findById(req.params.id);
          if (tutor && baseUser) {
            await baseUser.delete();
            await tutor.delete();
            return res.status(200).json({ message: 'Tutor deleted successfully' });
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      }

        const updatePassword = async (req, res) => { //put middleware for password validation
            try {
              const { password, newPassword } = req.body;
              const tutor = await tutorModel.findById(req.user.id);
              if (tutor) {
                const isMatch = await bcrypt.compare(password, tutor.hashedPass);
                if (isMatch) {
                  tutor.hashedPass = await bcrypt.hash(newPassword, 10);
                  await tutor.save();
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
    const tutor = await tutorModel.findById(req.user.id);
    if (tutor) {
      if (operation === 'add') {
        tutor.address.push(address);
        await tutor.save();
        return res.status(200).json({ message: 'Address added successfully' });
      } else if (operation === 'update') {

        tutor.address = []
        tutor.address.push(address)
        await tutor.save()
        return res.status(200).json({ message: 'Address updated successfully' });
      }
      else if (operation === "delete"){
          tutor.address = []
          await tutor.save()
          return res.status(200).json({ message: 'Address deleted successfully' });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateEdu = async (req, res) => {
  try {
    const { operation } = req.params;
    const { education } = req.body;
    const tutor = await tutorModel.findById(req.user.id);
    if (tutor) {
      if (operation === 'add') {
        if (education) {
          tutor.education.push(education);
        }
        await tutor.save();
        return res.status(200).json({ message: 'Education added successfully' });
      } else if (operation === 'update') {
        if (education) {
          tutor.education = [];
          tutor.education.push(education);
        }
        await tutor.save();
        return res.status(200).json({ message: 'Education updated successfully' });
      } 
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateExp = async (req, res) => {
  try {
    const { operation } = req.params;
    const { experince } = req.body;
    const tutor = await tutorModel.findById(req.user.id);
    if (tutor) {
      if (operation === 'add') {
        if (experince) {
          tutor.experince.push(experince);
        }
        await tutor.save();
        return res.status(200).json({ message: 'experience added successfully' });
      } else if (operation === 'update') {
        if (experince) {
          tutor.experince = [];
          tutor.experince.push(experince);
        }
        await tutor.save();
        return res.status(200).json({ message: 'experience updated successfully' });
      } 
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getTutor,
    updateTutor,
    deleteTutor,
    updateEdu,
    updateExp,
    updateAddress,
    updatePassword,
}
