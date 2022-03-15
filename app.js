const express = require('express');
const ExpressError = require('./expressError');
const itemRoutes = require('./itemRoutes');
const morgan = require('morgan')

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/items', itemRoutes);
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

//  404 handler
app.use((req, res, next) => {
    const error = new ExpressError('Page not found', 404);
    next(error);
});

// generic error handling
app.use(function (error, req, res, next){
    let status = error.status || 500;
    let message = error.msg;

    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;
