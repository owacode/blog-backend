const mongoose= require('mongoose');

const author = mongoose.Schema({
  // Basic Info
  name:{type: String},
  bio:{type: String},
  location:{type: String},
  date_added:{type: Date},
  date_approved:{type: Date},
  image:{type: String},
  email:{type: String, unique:true},
  password:{type: String},
  salt:{type: String},
  token:{type: String},
  main_id:{type:String},
  verified:{type:Boolean},
  form_filled:{type:Boolean},
  //like blog
  liked_blog:[],
  // Social Accounts
  linkedIn_id:{type: String},
  twitter_id:{type: String},
  // BLogs added by user
  // it will contain the id of the blogs
  approved_blogs_added:[],
  unapproved_blogs_added:[],
  all_blogs_added:[],
  approved_blogs_count:{type: Number, default: 0}
  // liked_blog:[] Remove it
})

module.exports = mongoose.model('ApprovedAuthor', author, 'ApprovedAuthors')
