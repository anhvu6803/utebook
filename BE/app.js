const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./src/routes/index');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: [process.env.WEB_URI, process.env.WEB_URI_2],
  credentials: true,
}));

app.use('/api', routes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  })

module.exports = app;

