//  MongoDB Models
const NotApprovedBlog= require('../../model/unapproved_blog');
const NotApprovedAuthor= require('../../model/unapproved_author');
const ApprovedAuthor= require('../../model/approved_author');
const ApprovedBlog= require('../../model/approved_blog');
const AllBlog= require('../../model/all_blog');
const AllAuthor= require('../../model/all_author');

// Controllers
const deleteController= require('./delete');
class AdderOperationController{
  // This methord is for posting a new blog
  //Initially Posting a New Blog will be saved in notapproved collection
    addNewBlogToUnApproved(value){
      const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
             ];
             var today = new Date();
             var date = monthNames[today.getMonth()]+' '+today.getDate()+','+today.getFullYear();
      return new Promise((resolve, reject)=>{
        this.addBlogToMain(value)
          .then((result)=> {
            const blog = new NotApprovedBlog({
              title:value.title,
              category:value.category,
              date_added:date,
              author_id:value.authorid,
              author_name:value.authorname,
              desc:value.desc,
              image:value.imageurl,
              main_id:result._id
            })

           return blog.save()
          })

            .then((result)=> resolve(result))
            .catch(err=> reject(err));
      })
    }

      // This methord is for posting a new blog
  //Initially Posting a New Blog will be saved in notapproved collection
  addNewBlogToApproved(value){
    console.log(value,value.id);
    const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
           ];
    return new Promise((resolve, reject)=>{

      var today = new Date();
      var date = monthNames[today.getMonth()]+'/'+today.getDate()+'/'+today.getFullYear();
      // First Deleting the unapproved blog from the collection
      deleteController.deleteUnapprovedBlog(value.id)
      .then(result => {
        // console.log("not approved blog", result);
        const blog = new ApprovedBlog({
          title:result.title,
          category:result.category,
          date_added:result.date_added,
          date_approved:date,
          author_id:result.author_id,
          author_name:result.author_name,
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
        this.addBlogToUser(id);
        resolve(result)
      })
      .catch(err=> reject(err));
    })
  }

  //This is for adding the blog to collection where all the blogs are stored
  addBlogToMain(values){
    const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
             ];
    var today = new Date();
    var date = monthNames[today.getMonth()]+' '+today.getDate()+','+today.getFullYear();
    return new Promise((resolve, reject)=>{
      const blog= new AllBlog({
        approved_id:'null',
        rejected:false,
        status:'pending',
        title:values.title,
        category:values.category,
        date_added:date,
        author_name:values.authorname,
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

  // This is for adding the new author
  // initially author will we unapproved
  addUnApprovedAuthor(values){
    console.log(values);
    const today= new Date();
    const date= today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear();
    return new Promise ((resolve, reject) => {
      this.addAuthorToMain(values)
      .then(result=>{
        const author= new NotApprovedAuthor({
          name:values.name,
          about_author:values.desc,
          image:values.imageurl,
          interest_category:values.interest_category,
          linkedIn_id:values.linkedin,
          twitter_id:values.twitter,
          facebook_id:values.facebook,
          email:values.email,
          instagram_id:values.instagram,
          date_added:date,
          main_id:result._id
        });
       return author.save();
      })

      .then(result=> {resolve(result); console.log(result,'mohidwdd')})
      .catch(err=> reject(err));
    })
  }

  // This is for approving the Author
  // to post the blog by approving his profile
  addApprovedAuthor(values){
    console.log("approve hit")
    return new Promise ((resolve, reject) => {
      const today= new Date();
      const date= today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear();
      // First Deleting the Auhor Profile from UnApproved Collection
      deleteController.deleteUnapprovedAuthor(values.id)
      .then(result=> {
        console.log(result,'hit app author')
        const author= new ApprovedAuthor({
          name:result.name,
          about_author:result.about_author,
          date_added:result.date_added,
          date_approved:date,
          image:result.image,
          followers:[],
          following:[],
          interest_category:result.interest_category,
          linkedIn_id:result.linkedIn_id,
          instagram_id:result.instagram_id,
          twitter_id:result.twitter_id,
          facebook_id:result.facebook_id,
          blogs_added:[]
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
      const today= new Date();
      const date= today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear();
      return new Promise((resolve, reject)=>{
        const blog= new AllAuthor({
          approved_id:'null',
          rejected:false,
          status:'pending',
          name:values.name,
          interest_category:values.interest_category,
          date_added:date,
          image:values.imageurl
        })

        blog.save()
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

  // This methord is for adding the blogid to the author account
  addBlogToUser(values){
      ApprovedAuthor.findByIdAndUpdate({_id:values.authorid},{
        $addToSet: {blogs_added: values.blogid}
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

}

module.exports= new AdderOperationController();

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