
/*
 * GET home page.
 */
var MongoDriver= require('../mongodriver').MongoDriver;
var mongodriver= new MongoDriver('localhost',27017);

exports.new_post = function(req, res){
  mongodriver.saveBlog({
    title: req.body.title,
    body: req.body.body
  }, function( error, docs ){
    res.redirect('/');
  });
};

exports.get_one  = function(req,res){
  mongodriver.findById('blogs', req.params.id, function(error, article){
      if (error){
        console.log(error);
        res.redirect('/blogs');
      }
      else {
        res.render('blog_show', {
            title: article.title,
            blog:article
        });
      }
  });
};

exports.post_comment  = function(req,res){
  mongodriver.save(req.body.id, {
      person: req.body.person,
      comment: req.body.comment,
      created_at: new Date()
  }, function(error, docs){
      if (error) res.redirect('/blogs');
      else res.redirect('/blogs/'+req.body.id);
  });
};

exports.list = function(req, res){
  mongodriver.findAndOrder('blogs', function(error, docs){
      res.render('blogs', {
          title: 'Blog',
          blogs:docs
      });
   });
};
