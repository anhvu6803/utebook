const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api',routes);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully!');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

