var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var config = require('./config.json');

MongoDriver = function(host, port) {
  this.db= new Db(config.database, new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//getCollection

MongoDriver.prototype.getCollection= function(group, callback) {
  this.db.collection(group, function(error, a_collection) {
    if( error ) callback(error);
    else callback(null, a_collection);
  });
};

//findAll
MongoDriver.prototype.findAll = function(group, callback) {
    this.getCollection(group, function(error, a_collection) {
      if( error ) callback(error)
      else {
        a_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findAandOrder
MongoDriver.prototype.findAndOrder = function(group, callback) {
    this.getCollection(group, function(error, a_collection) {
      if( error ) callback(error)
      else {
        a_collection.find().sort({id:-1}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findById
MongoDriver.prototype.findById = function(group, record_id, callback) {
    console.log("finding " + group + ": " + record_id);
    this.getCollection(group, function(error, a_collection) {
      if( error ) callback(error)
      else {
        a_collection.findOne({ id: parseInt(record_id) }, function(error, result) {
          if( error ) callback(error)
          else {
            if (null == result){ 
              callback("no records found");
            } else {
              console.log("found: " + result);
              callback(null, result)
            }
          }
        });
      }
    });
};

//save
MongoDriver.prototype.save = function(group, articles, callback) {
    this.getCollection(group, function(error, a_collection) {
      if( error ) callback(error)
      else {
        a_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

MongoDriver.prototype.edit = function(group, articleId, updateData, callback){
  this.getCollection(group, function(error, a_collection) {
    if( error ) callback( error );
    else {
      a_collection.update(
        {_id: a_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
        updateData,
        function(error, article){
          if( error ) callback(error);
          else callback(null, article)
        });
    }
  });
};

MongoDriver.prototype.addCommentToArticle = function(articleId, comment, callback) {
  this.edit('blogs', articleId, {"$push": {comments: comment}}, callback);
};

exports.MongoDriver = MongoDriver;
