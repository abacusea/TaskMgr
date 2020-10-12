const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')


require('dotenv').config()
// import routes
const userRoutes = require('./routes/user')
const companyRoutes = require("./routes/company")

// app
const app = express()

// db
const mongodb = 'mongodb://localhost:27017/employeeDailyTaskApp'
mongoose
    .connect(mongodb, {
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log(`connected to MongoDb on ${mongodb}`));

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// routes middleware
app.use('/', userRoutes)
app.use('/', companyRoutes)

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
