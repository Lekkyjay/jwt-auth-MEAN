const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true,  useUnifiedTopology: true})
  .then(() => { console.log('You are connected to MongoDB. Great!') })
  .catch((err) => { console.log('Connection failed...' + err) });

//MIDDLEWARES - Functions that have access to all the req and res objects
app.use(express.json());

//IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//ROUTE MIDDLEWARES
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log('Server listening on port 3000'));