//  MongoDB Models
const NotApprovedBlog = require('../../model/unapproved_blog');
const NotApprovedAuthor = require('../../model/unapproved_author');
const ApprovedAuthor = require('../../model/approved_author');
const ApprovedBlog = require('../../model/approved_blog');
const AllBlog = require('../../model/all_blog');
const SavedBlog = require('../../model/savedblog');
const HomeBlog = require('../../model/homeblog');
const AllAuthor = require('../../model/all_author');

const AuthorVideo = require('../../model/author_video');
class FetchController {

  
  getUserLikedParticularBlog(values) {
    return new Promise((resolve, reject) => {

      ApprovedAuthor.find({ $and: [{ _id: values.userid }, { liked_blog: values.blogid }] })
        .then(result => {
          console.log(result.length, '(((((')
          resolve(result.length);
        })
        .catch(err => {
          reject(err);
        });

    })
  }

  // Fetching all Blogs from DB
  getApprovedBlogs(value) {
    console.log(value, 'aaa')
    return new Promise((resolve, reject) => {
      //     const query= ApprovedBlog.find();
      //     const pagesize= +value.pagesize;
      //     const currentpage= +value.currentpage;
      //     let fetchblogs;

      //     if(pagesize && currentpage){
      //       query
      //       .skip(pagesize * (currentpage - 1))
      //       .limit(pagesize);
      //     }
      //     query
      //     .then(documents=> {
      //       // console.log(documents,'dsdw');
      //       fetchblogs= documents;
      //       return Blog.count();
      //     })
      //     .then(totalBlogs=> resolve(fetchblogs, totalBlogs))
      //     .catch(err => reject(err));
      ApprovedBlog.find({})
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getAllBlogs() {
    return new Promise((resolve, reject) => {
      AllBlog.find({})
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getHomeSingleBlogs(id) {
    return new Promise((resolve, reject) => {
      HomeBlog.find({ _id: id })
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getSingleAllBlogs(id) {
    return new Promise((resolve, reject) => {
      AllBlog.find({ _id: id })
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getNotApprovedBlogs() {
    return new Promise((resolve, reject) => {
      NotApprovedBlog.find({})
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getCategoryApprovedBlogs(category) {
    return new Promise((resolve, reject) => {
      ApprovedBlog.find({ sub_category: category }).sort({ "date_added": -1 })
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }


  getSingleApprovedBlogs(id) {
    return new Promise((resolve, reject) => {
      ApprovedBlog.find({ _id: id })
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getSingleNotApprovedBlog(id) {
    return new Promise((resolve, reject) => {
      NotApprovedBlog.find({ _id: id })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  getSavedBlogsByAuthor(id) {
    return new Promise((resolve, reject) => {
      SavedBlog.find({author_id:id}).sort({ "date_added": -1 })
        .then(result => {
          return resolve(result);
        })
        .catch(err => {
          return reject(err);
        });
    })
  }

  getSingleSavedBlog(id) {
    return new Promise((resolve, reject) => {
      SavedBlog.findOne({_id:id})
        .then(result => {
          return resolve(result);
        })
        .catch(err => {
          return reject(err);
        });
    })
  }

  getApprovedBlogsByAuthor(id) {
    return new Promise((resolve, reject) => {
      this.getSingleApprovedAuthor({ _id: id })
        .then(result => {
          let blogs_id = result[0].approved_blogs_added;
          return ApprovedBlog.find({ _id: { $in: blogs_id } })
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => reject(err));
    })
  }

  getUnapprovedBlogsByAuthor(id) {
    return new Promise((resolve, reject) => {
      this.getSingleApprovedAuthor({ _id: id })
        .then(result => {
          let blogs_id = result[0].unapproved_blogs_added;
          return NotApprovedBlog.find({ _id: { $in: blogs_id } })
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => reject(err));
    })
  }

  getAllBlogsByAuthor(id) {
    return new Promise((resolve, reject) => {
      this.getSingleApprovedAuthor({ _id: id })
        .then(result => {
          let blogs_id = result[0].all_blogs_added;
          console.log(blogs_id);
          return AllBlog.find({ _id: { $in: blogs_id } })
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => reject(err));
    })
  }

  // Blogs that are show on the carousel which has three blogs
  getHomeBlogs() {
    return new Promise((resolve, reject) => {
      HomeBlog.find({})
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  /* <!------------------------------------------------------**********BLOG END***********-------------------------------------------!> */
  getNotApprovedAuthor() {
    return new Promise((resolve, reject) => {
      NotApprovedAuthor.find({})
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getSingleNotApprovedAuthor(id) {
    return new Promise((resolve, reject) => {
      NotApprovedAuthor.find({ _id: id })
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getSingleApprovedAuthor(id) {
    console.log(id, 'dwfcwe')
    return new Promise((resolve, reject) => {
      ApprovedAuthor.find({ _id: id })
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getApprovedAuthor() {
    return new Promise((resolve, reject) => {
      ApprovedAuthor.find({})
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

    getTopAuthor() {
    return new Promise((resolve, reject) => {
      ApprovedAuthor.find({}).sort({ "approved_blogs_count": -1 }).limit(3)
        .then(result => {
          return resolve(result);
        })
        .catch(err => {
          return reject(err);
        });
    })
  }


  getAllAuthor() {
    return new Promise((resolve, reject) => {
      AllAuthor.find({})
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getSingleAllAuthor(id) {
    return new Promise((resolve, reject) => {
      AllAuthor.find({ _id: id })
        .then(result => {
          // console.log(result);
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }


  //<<--------------------------------------------------------------------Video Posted By Author Starts--------------------------------------------------------------------->>
  getVideo() {
    return new Promise((resolve, reject) => {
      AuthorVideo.find({})
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getSingleVideo(id) {
    return new Promise((resolve, reject) => {
      AuthorVideo.find({ _id: id })
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  getAuthorVideo(email) {
    return new Promise((resolve, reject) => {
      AuthorVideo.find({ author_email: email })
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

    getMostLikedBlogs() {
    return new Promise((resolve, reject) => {
      ApprovedBlog.find().sort({ "likecount": -1 }).limit(5)
        .then(result => {
          resolve(result)
        })
        .catch(err => reject(err));
    })
  }

  //<<--------------------------------------------------------------------Video Posted By Author Ends--------------------------------------------------------------------->>
}

module.exports = new FetchController()

