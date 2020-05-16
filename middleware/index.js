module.exports = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'You need to login first');
        res.redirect('/login');
    }
} 