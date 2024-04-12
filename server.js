const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const port = process.env.PORT || 3000;
var http = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Successfully Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Funzy Backend API');
});


// Routes
const routes = require('./routes/route');
const adminRoutes = require('./routes/adminRoute');

app.use('/', routes);
app.use('/admin/', adminRoutes);

const PORT = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;