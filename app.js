const express = require('express');
const app=express()
const userController=require('./controller/userController')
const ejs=require('ejs')
const router =require('./router')
const flash=require('connect-flash')
const session =require('express-session')
const cookieParser=require('cookie-parser')
const MongoStore=require('connect-mongo');
const req = require('express/lib/request');


let sessionOptions=session({
    secret:'trying to learn some code by my self',
    store:new MongoStore({
        client:require('./db'),
        httpOnly:true
    }),
    resave:false,
    saveUninitalized:true,
    maxAge:1000*60*60*24,
    cookies:{secure:true}
})
app.use(sessionOptions)
app.use(cookieParser())
app.use(flash())
app.use(express.static('public'))
app.set('views','views')
app.use(function(req,res,next){
    res.locals.user= req.session.user
    next()
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',router)
app.use(express.static('uploads'))
module.exports=app