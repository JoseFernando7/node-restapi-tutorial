const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect(
    'mongodb+srv://josef7:josef7@node-rest-shop.srldg5w.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop');

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((request, response, next) => 
{
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (request.method === 'OPTIONS')
    {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

        return response.status(200).json({});
    }

    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Handling errors
app.use((request, response, next) => 
{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, request, response, next) => 
{
    response.status(error.status || 500);

    response.json(
    {
        error: {
            message: error.message,
        }
    });
});

module.exports = app;
