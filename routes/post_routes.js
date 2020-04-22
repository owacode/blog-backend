
const express = require('express');
const routes = express.Router();
const upload = require('./multer');
const cloudinary = require('cloudinary');
const cloudinarydetail = require('./cloudinary');
// Controllers
const adderController = require('./controller/adder');
const deleteController = require('./controller/delete');
const updateController = require('./controller/update');
const fetchController = require('./controller/fetch');

// Like the Blog
routes.post('/like', (req, res) => {
  console.log(req.body, 'test');
  adderController.likeTheBlog(req.body)
    .then(result => {
      updateController.updateLikeBlog(req.body.blogid)
      res.redirect(`https://onewater-auth.herokuapp.com/likeblog?userid=${req.body.userid}&blogid=${req.body.blogid}`)
    })
    .catch(err => res.status(401).json({
      status: "error for 3000",
      payload: err
    }));
})

// Like the Landing Blog
routes.post('/like-homeblog', (req, res) => {
  console.log(req.body, 'test');
  adderController.likeTheLandingBlog(req.body)
    .then(result => {
      updateController.updateLikeHomeBlog(req.body.blogid)
      res.redirect(`https://onewater-auth.herokuapp.com/likeblog?userid=${req.body.userid}&blogid=${req.body.blogid}`)
    })
    .catch(err => res.status(401).json({
      status: "error for 3000",
      payload: err
    }));
})

// Route for adding Videos by Author
routes.post('/post-video', (req, res) => {
  adderController.addVideoByAuthor(req.body)
    .then((result) => res.status(200).json({
      status: "success",
      msg: "Blog Rejected"
    }))
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})


// This is for adding single image from editor
routes.post('/addimage', upload.single('image'), async (req, res) => {
  console.log('hittttttttttttt', req.file);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  const imagepath = result.url;
  console.log('image added to db', imagepath);
  res.json({
    imagepath: imagepath,
    msg: "Image Added successfully"
  })
})

// Route for Blog to Home The Home Page Blogs ( 3 Blogs )
routes.post('/homeblog', upload.single('image'), async (req, res) => {
  console.log(req.body);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  const imagepath = result.url;
  req.body.imageurl = imagepath;
  adderController.addHomeBlog(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Blog is added for HomePage",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

//Update  Route for Blog to Home The Home Page Blogs ( 3 Blogs )
routes.patch('/homeblog', upload.single('image'), async (req, res) => {
  console.log(req.body);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  const imagepath = result.url;
  req.body.imageurl = imagepath;
  updateController.updateHomeBlog(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Update Blog for HomePage",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})
// Route for UnApproved BLogs
routes.post('/unapproved-blog', upload.single('image'), async (req, res) => {
  console.log(req.body);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  req.body.imageurl = result.url;
  adderController.addNewBlogToUnApproved(req.body)
    .then(result => {
      // adderController.addBlogToMain(result);
      res.status(200).json({
        status: "success",
        msg: "Blog is send for verification you will be respond back in 24 hours",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for UnApproved BLogs
routes.post('/saved-unapproved-blog-with-image', upload.single('image'), async (req, res) => {
  console.log(req.body);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  req.body.imageurl = result.url;
  deleteController.deleteSavedBlog(req.body.savedid);
  adderController.addNewBlogToUnApproved(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Blog is send for verification you will be respond back in 24 hours",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for UnApproved BLogs from saved without image upload
routes.post('/saved-unapproved-blog', (req, res) => {
  console.log(req.body);
  req.body.imageurl = req.body.image;
  deleteController.deleteSavedBlog(req.body.savedid);
  adderController.addNewBlogToUnApproved(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Blog is send for verification you will be respond back in 24 hours",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Approving the BLogs
routes.post('/approve-blog', (req, res) => {
  console.log(req.body, 'catehitttt');
  const id = {
    mainid: req.body.mainid
  }
  adderController.addNewBlogToApproved(req.body)
    .then(result => {
      id.approveid = result._id;
      updateController.approveBlog(id);
      res.status(200).json({
        status: "success",
        msg: "Blog is Approved",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Saved Blogs
routes.post('/save-blog', upload.single('image'), async (req, res) => {
  console.log(req.body, 'catehitttt');
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  req.body.imageurl = result.url;
  adderController.addToSavedBlog(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Blog is added to saved blog",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Saved Blogs
routes.patch('/updateimage-saved-blog', upload.single('image'), async (req, res) => {
  console.log(req.body, 'updated saved hit');
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  req.body.imageurl = result.url;
  updateController.updateSavedWithImageBlog(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Saved Blog Updated",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Saved Blogs
routes.patch('/update-saved-blog', (req, res) => {
  console.log(req.body, 'updated saved hit');
  updateController.updateSavedBlog(req.body)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Saved Blog Updated",
        payload: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Deleteing Approved Blogs
routes.post('/deleteapproveblog', (req, res) => {
  console.log(req.body);
  deleteController.deleteApprovedBlog(req.body)
    .then(result => res.status(200).json({
      status: "success",
      msg: "Approved Blog Deleted Successfully",
      result: result
    }))
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Deleteing the UnApproved BLogs
routes.post('/deleteunapproveblog', (req, res) => {
  console.log(req.body);
  deleteController.deleteAuthorUnapprovedBlog(req.body)
    .then((result) => res.status(200).json({
      status: "success",
      msg: "UnApproved Blog Deleted Successfully"
    }))
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

/*<-------------------------------------------------######Blogs Routes End######--------------------------------------------------->*/


// Route for UnApproved Author Profile
routes.post('/unapproved-author', async (req, res) => {
  adderController.addUnApprovedAuthor(req.body)
    .then(result => {
      // adderController.addAuthorToMain(result);
      res.status(200).json({
        status: "success",
        msg: "Profile is send for verification you will be respond back in 24 hours"
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for UnApproved Author Profile
routes.post('/update-authorprofile', upload.single('image'), async (req, res) => {
  console.log(req.body);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  req.body.imageurl = result.url;
  console.log(res.body);
  updateController.updateAuthorProfile(req.body)
    .then(result => {
      // adderController.addAuthorToMain(result);
      res.status(200).json({
        status: "success",
        msg: "Profile is send for verification you will be respond back in 24 hours"
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for UnApproved Author Profile
routes.post('/update-approveprofile-with-image', upload.single('imageurl'), async (req, res) => {
  console.log(req.body);
  const result = await cloudinary.v2.uploader.upload(req.file.path)
    .catch((err) => {
      new Promise(() => { throw new Error('exception!'); });
      console.log(err);
    })
  req.body.imageurl = result.url;
  updateController.updateAuthorApprovedProfile(req.body)
    .then(result => {
      // adderController.addAuthorToMain(result);
      res.status(200).json({
        status: "success",
        msg: "Profile is Updated"
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for UnApproved Author Profile
routes.post('/update-approveprofile', (req, res) => {
  console.log(req.body);
  updateController.updateAuthorApprovedProfile(req.body)
    .then(result => {
      // adderController.addAuthorToMain(result);
      res.status(200).json({
        status: "success",
        msg: "Profile is Updated"
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})
// Route for Approving Author Profile
routes.post('/approve-author', (req, res) => {
  const id = {
    mainid: req.body.mainid
  }
  adderController.addApprovedAuthor(req.body)
    .then(result => {
      console.log(result._id, 'idddddddd');
      id.approveid = result._id;
      console.log(id, 'dfdsf');
      updateController.approveAuthor(id);
      res.status(200).json({
        status: "success",
        msg: "Author Profile is Approved",
        result: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Rejecting the Author Profile
routes.post('/reject-author', (req, res) => {
  console.log(req.body, 'body');
  deleteController.deleteUnapprovedAuthor(req.body.id)
    .then(result => {
      updateController.rejectAuthorProfile(req.body)
      res.status(200).json({
        status: "success",
        msg: "Author Profile Rejected"
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})

// Route for Getting Details of Author Profile
routes.get('/single-author/:id', (req, res) => {
  fetchController.getSingleApprovedAuthor(req.params.id)
    .then(result => {
      res.status(200).json({
        status: "success",
        msg: "Author Profile",
        result: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      payload: err
    }));
})


/*<-------------------------------------------------######Other Routes for Authentication######--------------------------------------------------->*/


// Route for Login
routes.post('/login', async (req, res) => {
  adderController.login(req.body)
    .then(result => {
      // adderController.addAuthorToMain(result);
      res.status(200).json({
        status: "success",
        msg: "Login Successfull",
        result: result
      })
    })
    .catch(err => res.status(200).json({
      status: "error",
      msg: err
    }));
})

// This is to Verify the Email

routes.get('/activate/:token', (req, res) => {
  adderController.verifyMail(req.params)
    .then(result => {
      res.status(200).redirect('http://onewateracademy.org/onewater/thankyou-author');
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        error: err
      })
    })
})

routes.post('/reset-password', (req, res) => {
  console.log(req.body);
  updateController.recoverPassword(req.body.email)
    .then(result => res.json({
      status: 'success',
      msg: 'Check you email',
      result: result
    }))
    .catch(err => res.json({
      status: 'error',
      msg: 'Email not Exist',
      error: err
    }))
})

routes.post('/update-password', (req, res) => {
  console.log(req.body);
  updateController.updatePassword(req.body)
    .then(result => res.json({
      status: 'success',
      msg: 'Password Update Successfully',
      result: result
    }))
    .catch(err => res.json({
      status: 'error',
      msg: 'Error in Updating Password',
      error: err
    }))
})
module.exports = routes;
