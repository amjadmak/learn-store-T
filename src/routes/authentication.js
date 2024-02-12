const express = require("express");
const {accountRegister, login, logout, verifyAccountEmail , resendVerificationEmail} = require("../controllers/authControl");
// const { passprot } = require("../config/passport");
const router = express.Router();
const {
RegisterMiddleware,
  LoginMiddleware,
  verifyValidationRules
} = require("../middleware/validationMiddleWare");
// const { MAX_IMAGE_SIZE } = require("../utility/constants"); 



const endPoints = [
  {
    route: "/tutorRegister",
    method: "post",
    controller: accountRegister,
    validation: RegisterMiddleware,
  },
  {
  route: '/resendVerificationEmail',
  method: 'post',
  controller: resendVerificationEmail,
},
  {
    route: "/learnerRegister",
    method: "post",
    controller: accountRegister,
    validation: RegisterMiddleware,
  },
  {
    route: '/verify/:id/:token',
    method: 'get',
    controller: verifyAccountEmail,
    validation: verifyValidationRules,
},
  {
    route: "/login",
    method: "post",
    controller: login,
    validation: LoginMiddleware,
  },
  {
    route: "/logout",
    method: "post",
    controller: logout,

  },
];

endPoints.forEach((endPoint) => {
  const route = [endPoint.route];
  if (endPoint.validation) {
    route.push(endPoint.validation);
  }
  route.push(endPoint.controller);
  router[endPoint.method](...route);
});
module.exports = router;
