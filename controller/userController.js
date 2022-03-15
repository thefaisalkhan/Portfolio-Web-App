const User=require('../model/User')
const Menu = require('../model/Menu');
const Work = require('../model/Work');
const Blog = require('../model/Blog')
const About = require('../model/About')
const nodemailer =require('nodemailer')
const dotenv = require('dotenv').config()
const Category = require('../model/Category');
const res = require('express/lib/response');
const req = require('express/lib/request');
const { blog } = require('./userController');
const Service = require('../model/Service');
const ObjectId = require('mongodb').ObjectId
const userCollection=require('../db').db().collection('users');
const menuCollection=require('../db').db().collection('menus');
const categoryCollection=require('../db').db().collection('categories');
const workCollection =require('../db').db().collection('works')
const serviceCollection =require('../db').db().collection('service_category')
const blogCollection=require('../db').db().collection('posts');
const aboutCollection=require('../db').db().collection('about');
const settingCollection=require('../db').db().collection('settings');



exports.index=async function(req,res){
res.render('frontend/index',{
    settings : await settingCollection.findOne(),
    menus : await menuCollection.find().toArray(),
    categories : await categoryCollection.find().toArray(),
    works : await workCollection.aggregate([
       {
           $lookup : {
               from : "categories",
               localField : "category_id",
               foreignField : "_id",
               as : "category"
           }
       } 
    ]).toArray()
})
}
exports.blog=async function(req,res){
    res.render('frontend/blog',{
        settings : await settingCollection.findOne(),
        menus : await menuCollection.find().toArray(),
        categories : await categoryCollection.find().toArray(),
        posts : await blogCollection.aggregate([
            {
                $lookup : {
                    from : "categories",
                    localField : "category_id",
                    foreignField : "_id",
                    as : "category"
                }
            } 
         ]).toArray()


    })
}
exports.get_contact=async function(req,res){
    res.render('frontend/contact',{
        settings : await settingCollection.findOne(),
        menus : await menuCollection.find().toArray(),
        categories : await categoryCollection.find().toArray(),
        works : await workCollection.find().toArray(),
        errors : req.flash('errors'),
        success : req.flash('success')


    })
}
exports.about=async function(req,res){
    res.render('frontend/about',{
        settings : await settingCollection.findOne(),
        menus : await menuCollection.find().toArray(),
        categories : await categoryCollection.find().toArray(),
        works : await workCollection.find().toArray(),
        about : await aboutCollection.findOne(),
        services : await serviceCollection.aggregate([
            {
                $lookup : {
                    from : "service_category",
                    localField : "_id",
                    foreignField : "category_id",
                    as : "services"
                }
            }
        ]).toArray()
    })
}



// POST route from contact form
exports.contact= function(req, res) {

    const GMAIL_USER= process.env.GMAIL_USER
    const GMAIL_PASS= process.env.GMAIL_PASS


    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      }
    })
  
    // Specify what the email will look like
    const mailOpts = {
      from: req.body.email, // This is ignored by Gmail
      to: GMAIL_USER,
      subject: req.body.subject,
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    }
  
    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        // Show a page indicating failure
        req.flash('errors','something went wrong')
        req.session.save(function(){
            res.redirect('/contact')
        })
      }
      else {
        req.flash('success','Message Sent')
        req.session.save(function(){
            res.redirect('/contact') // Show a page indicating success
      })
    }
    })
}
