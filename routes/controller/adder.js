//  MongoDB Models
const NotApprovedBlog= require('../../model/unapproved_blog');
const NotApprovedAuthor= require('../../model/unapproved_author');
const ApprovedAuthor= require('../../model/approved_author');
const ApprovedBlog= require('../../model/approved_blog');
const AllBlog= require('../../model/all_blog');
const HomeBlog= require('../../model/homeblog');
const AllAuthor= require('../../model/all_author');

const AuthorVideo= require('../../model/author_video');

// Controllers
const deleteController= require('./delete');
const updateController= require('./update');
const crypto= require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer= require('nodemailer');
//Transpoter for sending mails
const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
      user: 'onewateracademy1@gmail.com',
      pass: 'onewater123'
  }
});
let token;
class AdderOperationController{

  // Add Blog to Home The Home Page Blogs ( 3 Blogs )
  addVideoByAuthor(value){
    console.log('hitfefe',value)
    return new Promise((resolve, reject)=>{
          const video = new AuthorVideo({
            author_email:value.title,
            title:value.category,
            date_added:getTime(),
            desc:value.desc,
            link:value.link
          })
         video.save()
          .then((result)=>{
            resolve(result);
          })
          .catch(err=> reject(err));
    })
  }

  // Add Blog to Home The Home Page Blogs ( 3 Blogs )
  addHomeBlog(value){
    console.log('hitfefe',value)
    return new Promise((resolve, reject)=>{
          const blog = new HomeBlog({
            title:value.title,
            category:value.category,
            date_added:getTime(),
            desc:value.desc,
            image:value.imageurl
          })
         blog.save()
          .then((result)=>{
            resolve(result);
          })
          .catch(err=> reject(err));
    })
  }

  // This methord is for posting a new blog
  //Initially Posting a New Blog will be saved in notapproved collection
    addNewBlogToUnApproved(value){
      console.log('hitfefe',value)
      return new Promise((resolve, reject)=>{
        this.addBlogToMain(value)
          .then((result)=> {
            console.log(result,'dwdw')
            const blog = new NotApprovedBlog({
              title:value.title,
              category:value.category,
              date_added:getTime(),
              author_id:value.authorid,
              read_time:value.readtime,
              desc:value.desc,
              image:value.imageurl,
              main_id:result._id
            })

           return blog.save()
          })

            .then((result)=>{
              let id={
                authorid:result.author_id,
                blogid:result._id,
                mainid:result.main_id
              }
              console.log(id,'mohit author$$$$$$$$$$$$')
              this.addUnapprovedBlogToUser(id);
              id={
                mainid:result.main_id,
                blogid:result._id,
              }
              updateController.addUnapproveIdToMainBlog(id);
              resolve(result);
            })
            .catch(err=> reject(err));
      })
    }

      // This methord is for posting a new blog
  //Initially Posting a New Blog will be saved in notapproved collection
  addNewBlogToApproved(value){
    console.log(value,'approved details category');
    return new Promise((resolve, reject)=>{

      // First Deleting the unapproved blog from the collection
      deleteController.deleteUnapprovedBlog(value.id)
      .then(result => {
        // console.log("not approved blog", result);
        const blog = new ApprovedBlog({
          title:result.title,
          category:value.category,
          sub_category:value.subcategory,
          read_time:result.read_time,
          date_added:result.date_added,
          date_approved:getTime(),
          author_id:result.author_id,
          main_id:result.main_id,
          desc:result.desc,
          likes:[],
          blog_no:0,
          tags:result.tags,
          image:result.image
        })
        return blog.save();
      })
      .then((result)=>{
        const id={
          authorid:result.author_id,
          blogid:result._id
        }
        // console.log(id,'author details0');
        this.addApprovedBlogToUser(id);
        resolve(result)
      })
      .catch(err=> reject(err));
    })
  }

  //This is for adding the blog to collection where all the blogs are stored
  addBlogToMain(values){
    console.log('hit all blogs',values);
    return new Promise((resolve, reject)=>{
      const blog= new AllBlog({
        approved_id:'null',
        unapproved_id:'null',
        author_id:values.authorid,
        read_time:values.readtime,
        rejected:false,
        status:'pending',
        title:values.title,
        category:values.category,
        date_added:getTime(),
        desc:values.desc,
        image:values.imageurl
      })

      blog.save()
      .then(result=> {
        console.log("Blog added to allblogs")
        resolve(result);
      })
      .catch(err=> {
        console.log("Error in adding blog to allblogs", err);
        reject(err);
      })
    })
  }

    // This methord is for adding the blogid to the author account (only for approved blogs)
    addApprovedBlogToUser(values){
      ApprovedAuthor.findByIdAndUpdate({_id:values.authorid},{
        $addToSet: {approved_blogs_added: values.blogid}
      })
      .then(result=>console.log("Adding blog to account Successfull",result))
      .catch(err=> console.log("Adding blog to account Error", err));
  }

    // This methord is for adding the blogid to the author account (for unapproved and all blogs)
    addUnapprovedBlogToUser(values){
        ApprovedAuthor.findByIdAndUpdate({_id:values.authorid},{
          $addToSet: {unapproved_blogs_added: values.blogid, all_blogs_added:values.mainid}
        })
        .then(result=>console.log("Adding blog to account Successfull",result))
        .catch(err=> console.log("Adding blog to account Error", err));
    }

  addLikeBlogToUser(values){
    const like={
      blogid:values.blogid
    }
    ApprovedAuthor.findByIdAndUpdate({_id:values.authorid},{ $addToSet: { liked_blog: like} })
          .then(result => console.log("Blog liked added to user"))
          .catch(err => console.log("Error in Adding Blog to liked"))
  }

  // This is for adding the new author
  // initially author will we unapproved
  addUnApprovedAuthor(values){
    console.log(values);
    token = jwt.sign({email:values.email}, '@@@#%&$ve%*(tok???//---==+++!!!e!!n)@rify@@@@');
    let salt;
    let hashpass;
    return new Promise ((resolve, reject) => {
        this.addAuthorToMain(values)
      .then(result=>{
        const author= new NotApprovedAuthor({
          name:values.name,
          about_author:'null',
          image:'null',
          interest_category:'null',
          linkedIn_id:'null',
          twitter_id:'null',
          facebook_id:'null',
          email:values.email,
          instagram_id:'null',
          date_added:getTime(),
          main_id:result._id,
          verified:false,
          token:result.token,
          form_filled:false,
          salt:result.salt,
          password:result.password,
        });
       return author.save();
      })

      .then(result=> {
        verifyUser(values.email);
        const data={
          unapproved_id:result._id,
          mainid:result.main_id
        }
        updateController.addunapproveidtoauthor(data);
        resolve(result);})
      .catch(err=> reject(err));
    })
  }

  // This is for approving the Author
  // to post the blog by approving his profile
  addApprovedAuthor(values){
    console.log("approve hit")
    return new Promise ((resolve, reject) => {
      // First Deleting the Auhor Profile from UnApproved Collection
      deleteController.deleteUnapprovedAuthor(values.id)
      .then(result=> {
        console.log(result,'hit app author')
        const author= new ApprovedAuthor({
          name:result.name,
          about_author:result.about_author,
          date_added:result.date_added,
          date_approved:getTime(),
          image:result.image,
          location:result.location,
          followers:[],
          following:[],
          interest_category:result.interest_category,
          email:result.email,
          linkedIn_id:result.linkedIn_id,
          instagram_id:result.instagram_id,
          twitter_id:result.twitter_id,
          facebook_id:result.facebook_id,
          blogs_added:[],
          main_id:result.main_id,
          verified:result.verified,
          token:token,
          form_filled:result.form_filled,
          salt:result.salt,
          password:result.password,
          all_blogs_added:[],
          unapproved_blogs_added:[],
          approved_blogs_added:[]
          // liked_blog:[]
        });
        return author.save();
      })
      .then(result=> resolve(result))
      .catch(err=> reject(err));
    })
  }

    //This is for adding the Author to collection where all the Authors are stored
    addAuthorToMain(values){
      token = jwt.sign({email:values.email}, '@@@#%&$ve%*(tok???//---==+++!!!e!!n)@rify@@@@');
      let salt;
      let hashpass;
      return new Promise((resolve, reject)=>{
        saltHashPassword(values.password)
        .then(result=> {
            salt=result.salt;
            hashpass=result.passwordHash;
            const blog= new AllAuthor({
              approved_id:'null',
              about_author:'null',
              rejected:false,
              status:'pending',
              name:values.name,
              interest_category:'null',
              date_added:getTime(),
              linkedIn_id:'null',
              twitter_id:'null',
              facebook_id:'null',
              email:values.email,
              instagram_id:'null',
              image:'null',
              verified:false,
              token:token,
              form_filled:false,
              salt:salt,
              password:hashpass,
            })
          return blog.save();
        })
        .then(result=> {
          console.log("Author added to allAuthor")
          resolve(result);
        })
        .catch(err=> {
          console.log("Error in adding Author to allAuthor", err);
          reject(err);
        })
      })
    }

// Login Function
login(userdata){
  return new Promise ((resolve, reject)=> {
    console.log(userdata);
    AllAuthor.find({email:userdata.email})
    .then(result=> {
      console.log('%%%%%%%', result)
      if(result.length==0){
          return reject('No User Found')
      }
      const passdata=sha512(userdata.password, result[0].salt);
      if(result[0].password !== passdata.passwordHash){
         return reject("Incorrect Password");
      }
      if(result[0].verified == false) return reject("User Email not Verified");
      const token=jwt.sign({email:result[0].email,userid:result[0]._id},'%%%$$#book!*!(se!!ing^^&min%$#*)((//or'
      )
      console.log(result[0]._id, result[0].unapproved_id)
      resolve({token:token, email:userdata.email, form_filled:result[0].form_filled, mainid:result[0]._id, id:result[0].unapproved_id, approvedid:result[0].approved_id, name:result[0].name});
    })
  })
}

    verifyMail(values){
    return new Promise ((resolve, reject)=> {
      AllAuthor.find({token:values.token})
      .then(result=>  {
        if(!result){
        return reject("Invalid Token");
        }
          const verification_result =jwt.verify(values.token,'@@@#%&$ve%*(tok???//---==+++!!!e!!n)@rify@@@@');
          const user = verification_result.email;
          console.log(user);
          AllAuthor.findOneAndUpdate({email:user}, {$set:{verified:true}})
          .then(result=> {
            console.log(result,'User Verified');
            return resolve(result);
          })

      })
    })
}

}

module.exports= new AdderOperationController();

// This Function is for Getting IST
function getTime(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  var currentTime = new Date();

  var currentOffset = currentTime.getTimezoneOffset();

  var ISTOffset = 330;   // IST offset UTC +5:30

  var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

  // ISTTime now represents the time in IST coordinates
  return ISTTime;
}

//  ################################# Crypto Salt Hash Functions Start ###############################
var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') /** convert to hexadecimal format */
          .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
hash.update(password);
var value = hash.digest('hex');
return {
    salt:salt,
    passwordHash:value
};
};

function saltHashPassword(userpassword) {
  console.log('salthash hit')
var salt = genRandomString(16); /** Gives us salt of length 16 */
var passwordData = sha512(userpassword, salt);
console.log('UserPassword = '+userpassword);
console.log('Passwordhash = '+passwordData.passwordHash);
console.log('nSalt = '+passwordData.salt);

return new Promise((resolve, reject)=> {
  resolve(passwordData);
})
}
//  ################################# Crypto Salt Hash Function Ends ###############################

function verifyUser(email){
  console.log('$$$$$$$$$',email,token);
    let sendingMail = {
      from:' "OneWater " <onewateracademy1@gmail.com> ',
      to: email,
      subject: "Verify Account✔", // Subject line
      text: "Verify your Email to get started with Selling and Buying of Books",
      html:`
      <h4>Hello Welcome to OneWater<h4>
      <p>Click on the link to Verify Your Account <a href="https://onewater-blog-api.herokuapp.com/activate/` +token+`">https://onewater-blog-api.herokuapp.com/activate/`+token+`
      </a>
      ` // html body
    }

    transporter.sendMail(sendingMail,(error,info)=>{
      if(error){
        console.log("Error Hit&&&&")
          console.log('Nodemoalier Error%%%%%%%%%',error);
      }
      else{
        console.log("Success Hit&&&&")
          console.log("Email Sent!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", info.response);
      }
  })
}

//Like a comment of a particular Blog
// likeComment(value){
//   return new Promise((resolve, reject)=> {
//     Blog.update(
//       { _id: value.id, "comments.userid":value.commentid},
//       { $inc: { "comments.$.like": 1 } }
//    )
//    .then(result=> resolve(result));
//   })
// }

// This methord is for adding a comment by User
  //Comment on a Blog
  // addComment(value){
  //   return new Promise((resolve, reject)=> {
  //     var today = new Date();
  //     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  //     const comment={
  //       userid:value.userid,
  //       username:value.username,
  //       comment:value.comment,
  //       dateadded:date,
  //       like:0
  //     }
  //     Blog.update(
  //       { _id: req.params.id},
  //       { $addToSet: { comments: comment} }
  //    )
  //    .then(result=>resolve(result))
  //    .catch(err=> reject(err));
  //   })
  // }
