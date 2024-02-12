const express = require("express");
const tutorControl = require("../controllers/tutorControl.js");
//   validateAddress may be needed in the future
const {
  validateUpdate,
  validatePassword,
  validateEduAndExp,
  validateAddress} = require("../middleware/validationMiddleWare.js");

const router = express.Router();

router.get("/:id", tutorControl.getTutor);
router.delete("/:id/delete", tutorControl.deleteTutor);
router.patch("/:id/update", validateUpdate, tutorControl.updateTutor);
router.patch(
  "/update/password",
  validatePassword,
  tutorControl.updatePassword
);
router.patch(
  "update/address/:operation",
  validateAddress,
  tutorControl.updateAddress
);
router.patch(
  "update/education/:operation",validateEduAndExp, tutorControl.updateEdu
)
router.patch(
  "update/experience/:operation",validateEduAndExp, tutorControl.updateExp
)


module.exports = router;
