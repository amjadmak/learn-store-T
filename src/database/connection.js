const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.sumoonf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectToMongo = () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`MongoDB Connected…`);
    })
    .catch((err) => {
      console.log("Database connection error: ", err);
    });
};
module.exports = connectToMongo;
