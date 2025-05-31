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
    origin: ['http://localhost:5173', 'http://localhost:8000', 'http://localhost:5000', 'http://localhost:3000'].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Content-Type',
        'Authorization',
        'x-user-email',
        'x-user-id',     
        'x-is-admin']
}));

app.use('/api', routes);


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000);
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app;

