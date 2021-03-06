const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

require('dotenv').config()

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);
//DB Config
const db = require('./config/database');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Method Override Middleware
app.use(methodOverride('_method'))

//Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash Middleware
app.use(flash());

//global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Connect to Mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB Connected...')
}).catch(err => console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Index Route
app.get('/', (req, res)=> {
    const title = 'Welcome!';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
});