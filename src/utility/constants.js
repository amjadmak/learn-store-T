module.exports = Object.freeze({
  EDUCATIONAL_YEAR: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "Undergraduate",
    "Graduate",
  ],
  PASSWORD_ERROR: "Passwords are not mathcing",
  DEFAULT_PROFILE_IMAGE: "PUT SOME STRING HERE",
  NAME_REGEX: new RegExp(/^[a-zA-Z]{2,}$/),
  USERNAME_REGEX: new RegExp(/^[a-zA-Z0-9\-_.]{2,20}$/),
  EMAIL_REGEX: new RegExp(
    /^[a-zA-Z0-9-_.]+@[a-z]+\.[a-z]{2,15}(\.[a-z]{2,3})?(\.[a-z]{2,3})?$/
  ),
  PASSWORD_REGEX: new RegExp(/^(?=.*[a-zA-Z]).{6,}$/),
  PHONE_REGEX: new RegExp(
    /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,15}/
  ),
  MAX_IMAGE_SIZE: 1024 * 1024 * 5,
  PROFILE_IMAGE_DIR : 'profileImages',
  FOURTEEN_DAYS_TIME: 1000 * 60 * 60 * 24 * 14,
  ADDRESS_REQUIRED_FIELDS: ['country', 'city'],
  FOURTEEN_DAYS_STRING: "14d",
  HASH_ROUNDS: 12,
  FOURTEEN_DAYS_MILLISECONDS: 1000 * 60 * 60 * 24 * 14,
  EMAIL_VERIFY_SUBJECT: "تأكيد البريد الإلكتروني",
  PUBLIC_AUTH_ROUTES: [
    '/api/authentication/login',
    '/api/authentication/tutorRegister',
    '/api/authentication/learnerRegister',
    '/api/authentication/google',
    '/api/authentication/google/callback',
    /^\/api\/authentication\/verify\/(?:([^/]+?))\/(?:([^/]+?))\/?$/i, // '/api/authentication/verify/:token/:id'
  ],
  PUBLIC_ROUTES: [
    { methods: ['GET'], url: '/' },
    { methods: ['GET'], url: '/api/' },
    { methods: ['GET'], url: '/api/posts' },
    { methods: ['GET'], url: /^\/api\/tutors\/(?:([^/]+?))\/?$/i },   // '/api/tutors/:id'
    { methods: ['GET'], url: /^\/api\/learners\/(?:([^/]+?))\/?$/i },   // '/api/learners/:id'
    { methods: ['GET'], url: /^\/api\/posts\/(?:([^\/]+?))\/?$/i }, // '/api/post/:id'

  ],
});

