const express = require('express')
const app = express()
const mongoose = require ('mongoose')
const ejsMate = require ('ejs-mate')
const path = require('path')
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');

const isloggedin =require("./Middleware/Loggedin")
const ExpressError = require("./Error/ExpressError")


 

const User = require('./Models/UserSchrma')
const Help = require('./Models/HelpSchema')

app.use(methodOverride('_method'))
app.use(bodyParser.json());


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


mongoose.connect('mongodb://127.0.0.1:27017/CommunityHelpBoard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;      

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});  
 

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "yourSecretKey", 
    resave: false,
    saveUninitialized: false
}));

app.use(flash());


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    req.session.currentUser = req.user
    next();
})


app.get("/register", (req, res) =>{
    res.render("Register")
})

app.post("/register" , async (req,res) =>{
    const {email , username , password} = req.body
    const newuser = new User({email , username})
    await User.register(newuser , password)
    res.redirect("/allhelp")
})

app.get("/login" , (req,res) =>{
    res.render("login")
})

app.post("/login" ,  passport.authenticate ('local', {failureFlash : true , failureRedirect : "/login"}), (req,res) => {
    res.redirect("/allhelp")
})


app.get("/logout", (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout(err => {
            if (err) {
                console.error("Logout Error:", err);
                return next(err);  
            }
            res.render("Home"); 
        });
    } else {
        res.render("Home"); 
    }
});


  




















app.get("/allhelp", async (req, res) => {
        const finds = await Help.find({}).populate("user");
        res.render("show", {finds , User: req.user} );
});  

app.get('/createhelp' , isloggedin, (req,res) => {
    if(req.isAuthenticated()){
        res.render('Help')
    }
    return res.redirect("/login")
})

app.post('/addhelp' , async(req,res) => {
    const newHelp = new Help(req.body)

    await newHelp.save()
    res.redirect("/allhelp")
})


app.get("/help/:id/edit" , async(req,res) =>{
    const {id} = req.params
    const find = await Help.findById(id)
    res.render("edit" , {find})
})

app.put("/help/:id/edit" , async(req, res) =>{
    const {id} = req.params
    const find = await Help.findByIdAndUpdate(id , req.body , { new: true })
    res.redirect("/allhelp")
})

app.delete("/help/:id/delete" , async(req,res) =>{
    const {id} = req.params
    await Help.findByIdAndDelete(id)
    res.redirect("/allhelp"); 

})
  



app.use((err,req,res,next) =>{
    const {message , statuscode=404 } = err;
    res.send(message).status(statuscode)
})









app.listen(3000 , () =>
    console.log("Started our our project raa")
)






