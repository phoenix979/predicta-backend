require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authController = require('./controllers/authController');
const patientController = require('./controllers/patientController');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(authController);
app.use(patientController);

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`)
});