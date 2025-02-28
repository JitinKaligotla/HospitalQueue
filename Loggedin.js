const isloggedin = (req, res, next ) => {
    if (!req.isAuthenticated()){
        req.flash("error" , "you have to login")
        return res.render("Home")
    }
    next();
}

module.exports=isloggedin