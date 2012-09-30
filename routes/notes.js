
/*
 * GET home page.
 */
var MongoDriver= require('../mongodriver').MongoDriver;
var mongodriver= new MongoDriver('localhost',27017);

exports.new_post = function(req, res){
  mongodriver.save({
    title: req.body.title,
    body: req.body.body
  }, function( error, docs ){
    res.redirect('/');
  });
};

exports.get_one  = function(req,res){
  mongodriver.findById('notes', req.params.id, function(error, article){
      if (error){
        console.log(error);
        res.redirect('/notes');
      }
      else {
        res.render('note_show', {
            title: article.title,
            note:article
        });
      }
  });
};

exports.list = function(req, res){
  mongodriver.findAndOrder('notes', function(error, docs){
      res.render('notes', {
          title: 'FeigDev - note',
          notes:docs
      });
   });
};
