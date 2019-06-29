const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB Connected...')
}).catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Index Route
app.get('/', (req, res)=> {
    const title = 'Dynamic Welcome!';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Process Idea Form
app.post('/ideas', (req, res) => {
    //Check to see if form is empty.
    let errors = [];
    if(!req.body.title){
        errors.push({text: 'Please add a title.'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add some details.'});
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        res.send('passed');
    }
});

const port = 5000;

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
});