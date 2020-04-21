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