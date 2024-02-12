
const { expressjwt: jwt } = require('express-jwt');
const { PUBLIC_AUTH_ROUTES, PUBLIC_ROUTES } = require('../utility/constants');

const allPublicPaths = PUBLIC_ROUTES.concat(PUBLIC_AUTH_ROUTES);
const authenticationMiddleware = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
  getToken: (req) => req.signedCookies.auth_token ?? req.cookies.auth_token,
  requestProperty: 'user',
}).unless({
  path: allPublicPaths,
});

module.exports = { authenticationMiddleware };