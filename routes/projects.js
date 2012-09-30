
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
  mongodriver.findById('projects', req.params.id, function(error, article){
      if (error){
        console.log(error);
        res.redirect('/projects');
      }
      else {
        res.render('project_show', {
            title: article.title,
            project:article
        });
      }
  });
};

exports.list = function(req, res){
  mongodriver.findAll('projects', function(error, docs){
      res.render('projects', {
          title: 'FeigDev - project',
          projects:docs
      });
   });
};
