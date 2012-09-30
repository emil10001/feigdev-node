
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('resume', { title: 'FeigDev - Résumé' })
};
