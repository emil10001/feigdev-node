
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login', { title: 'FeigDev - Login' });
};

exports.authenticate = function(req, res){
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' });
};
