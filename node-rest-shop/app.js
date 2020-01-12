const express = require('express');
const app = express();//executes express like a function
const morgan =  require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://Annette:'+ process.env.MONGO_ATLAS_PW + '@node-rest-shop-0ub8u.mongodb.net/test?retryWrites=true&w=majority',
{
    //useMONGOClient: true
     useNewUrlParser: true,
     useUnifiedTopology: true 
});

app.use(morgan('dev')); 
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    //gives access to any origin. i.e. the use of '*' gives access to any origin
    res.header("Access-Control-Allow-Origin","*");// can be set to '*' or the websites you are givind access to e.g 'http://my-cool-page.com'
    //defines with headers we want to accept. i.e. which headers maybe sent along with the request
    res.header("Access-Control-Allow-Headers","Origin, C-Requested-With, Consent-Type, Accept, Authorization");// can be set to * also are whar is in brackets
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// use- a method that sets up middleware i.e. an incoming request has to go through app.use and whatever we pass to it
//routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

//Error Handling - below code catches any requests that make it past the above middlewares
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);

});

//Error handling- handles above  error and any othererrors thrown from anywhere else in this application
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
