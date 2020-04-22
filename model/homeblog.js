const mongoose= require('mongoose');
// Package to make a field of table auto-increasement
const auoInCrease = require('mongodb-autoincrement');
/**
 * Create Blog Model
 * Add AutoIncrease Plugin
 */
const blog = mongoose.Schema({
  title:{type: String,required:true},
  category:[],
  date_added:{type: String},
  desc:{type: String,required:true},
  contributor_name:{type: String,required:true},
  contributor_company:{type: String,required:true},
  likes:[],
  likecount:{type:Number},
  image:{type: String,required:true}
});

module.exports = mongoose.model('HomeBlog', blog, 'HomeBlogs');
