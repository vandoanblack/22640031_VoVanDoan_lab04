const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
require('dotenv').config(); // load .env sớm
const connectMongo = require('./server/database/connect');

const app = express();
const PORT = process.env.PORT || 3100;

// View engine & views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Parsers (thay cho body-parser)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override cho form PUT/DELETE: action="/url?_method=PUT"
app.use(methodOverride('_method'));

// Logger
app.use(morgan('tiny'));

// Kết nối MongoDB
connectMongo();

// Routes
app.use('/', require('./server/routes/routes'));

// 404 Not Found
app.use((req, res) => {
    res.status(404);
    return res.render('error', { error: 'Not Found' });
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    return res.render('error', { error: err.message || 'Server Error' });
});

app.listen(PORT, () => {
    console.log('listening on ' + PORT);
    console.log(`Welcome to the Drug Monitor App at http://localhost:${PORT}`);
});