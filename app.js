const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console, "Conection Error"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))

app.get('/',(req,res) => {
    res.render('home');
})

app.get('/campgrounds',async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('index',{campgrounds})
})

app.get('/campgrounds/new', (req,res) => {
    res.render('new');
})

app.post('/campgrounds/new', async(req,res) => {
    const camp = new Campground(req.body)
    await camp.save();
    console.log(req.body);
    res.redirect('/campgrounds')
})

app.get('/campgrounds/:id', async(req,res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('show',{camp})
})

app.get('/campgrounds/:id/edit', async(req,res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('edit',{ camp })
})

app.put('/campgrounds/:id', async(req,res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/campgrounds/${camp._id}`)
})

app.delete('/campgrounds/:id', async(req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})