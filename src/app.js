require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");
const { encryptCookieNodeMiddleware } = require("encrypt-cookie");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const cors = require("cors");

const connectToMongo = require("./database/connection");
const {authenticationMiddleware} = require("./middleware/security");
////TO CHANGE THE POST TYPE ACCORDING TO THE USER
const googleRoutes = require("./routes/google"); 
const authenticationRoutes = require("./routes/authentication");
const tutorRoutes = require('./routes/tutors');
const learnerRoutes = require('./routes/learners');
const postRoutes = require('./routes/posts');

const constants = require("./utility/constants");
// const { errorHandler, corsOptions } = require('./utility/utils');

const app = express();
const port = 3000;
// process.env.PORT || 
// to add cors options later.
// app.use(cors());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));


// to check the "extended" option in the end"
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api/google-auth', googleRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/authentication", authenticationRoutes);


app.use(authenticationMiddleware);

app.use('/api/tutor', tutorRoutes);

app.use('/api/learners', learnerRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, async () => {
        console.log(`Server listening on port ${port}`);
        await connectToMongo();
    });
}

// TRY TO PLAY WITH THE ORDER OF EACH ROUTE AND EVEN WITH THE MIDDLEWARE

