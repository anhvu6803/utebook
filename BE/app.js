const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./src/routes/index');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: process.env.WEB_URI,
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

