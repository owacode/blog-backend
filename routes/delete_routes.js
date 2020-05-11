const express = require('express');
const routes = express.Router();

const deleteController = require('./controller/delete');

routes.post('/unapprove-blog',(req, res)=> {
    console.log(req.body);
    deleteController.deleteUnApprovedBlogFromAdmin(req.body)
    .then(result=>{
        res.json({
            status: 'success',
            msg:"UnApproved Blog Deleted"
        })
    })
    .catch(err=>{
        res.json({
            status: 'success',
            msg:"UnApproved Blog Cannot be Deleted"
        })
    })
})

routes.delete('/home-blog/:id',(req, res)=> {
    console.log(req.params.id);
    deleteController.deleteHomeBlog(req.params.id)
    .then(result=>{
        res.json({
            status: 'success',
            msg:"Home Blog Deleted"
        })
    })
    .catch(err=>{
        res.json({
            status: 'success',
            msg:"Home Blog Cannot be Deleted"
        })
    })
})

routes.delete('/unapproved-author',(req, res)=> {
    // console.log(req.params.id);
    deleteController.deleteUnapprovedAuthor(req.body)
    .then(result=>{
        res.json({
            status: 'success',
            msg:"UnApproved Author Blog Deleted"
        })
    })
    .catch(err=>{
        res.json({
            status: 'success',
            msg:"UnApproved Author Cannot be Deleted"
        })
    })
})

routes.delete('/approved-author',(req, res)=> {
    // console.log(req.params.id);
    deleteController.deleteApprovedAuthor(req.body)
    .then(result=>{
        res.json({
            status: 'success',
            msg:"Approved Author Deleted"
        })
    })
    .catch(err=>{
        res.json({
            status: 'success',
            msg:"Approved Author Cannot be Deleted"
        })
    })
})

// routes.delete('/approve-blog',(req, res)=> {
//     deleteController.deleteApprovedBlogFromAdmin(req.body)
//     .then(result=>{
//         res.json({
//             status: 'success',
//             msg:"Approved Blog Deleted"
//         })
//     })
//     .catch(err=>{
//         res.json({
//             status: 'success',
//             msg:"Approved Blog Cannot be Deleted"
//         })
//     })
// })


module.exports = routes;