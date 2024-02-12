const express = require("express");
const learnerControl = require("../controllers/learnerControl.js");
//   validateAddress may be needed in the future
const {
  validateUpdate,
  validatePassword,
  validateAddress} = require("../middleware/validationMiddleWare.js");

const router = express.Router();

router.get("/:id", learnerControl.getLearner);
router.delete("/delete", learnerControl.deleteLearner);
router.patch("/update", validateUpdate, learnerControl.updateLearner);
router.patch(
  "/update/password",
  validatePassword,
  learnerControl.updatePassword
);
router.patch(
  "update/address/:operation",
  validateAddress,
  learnerControl.updateAddress
);


module.exports = router;
