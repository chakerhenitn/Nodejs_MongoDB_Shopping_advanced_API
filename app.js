const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
// connection to the database 


mongoose.connect('mongodb+srv://chakerhenitn:chakerhenitn@nodejsapi.svop4cj.mongodb.net/?retryWrites=true&w=majority', {
useNewUrlParser: true,
useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;




//end database connection

app.use(morgan('dev'));
//apply bodyparser to requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
///
// use CORS  to protect the API from not allowed access make it beforeroutes declaration
//add some headers to the response
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes to handle the requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=>{
    const error = new Error('Can not display this content');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;