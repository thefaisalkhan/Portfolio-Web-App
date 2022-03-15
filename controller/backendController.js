const User=require('../model/User')
const Menu = require('../model/Menu');
const Work = require('../model/Work');
const Blog = require('../model/Blog')
const About = require('../model/About')
const Category = require('../model/Category');
const res = require('express/lib/response');
const req = require('express/lib/request');
const { blog } = require('./userController');
const Service = require('../model/Service');
const Setting = require('../model/Setting');
const ObjectId = require('mongodb').ObjectId
const userCollection=require('../db').db().collection('users');
const menuCollection=require('../db').db().collection('menus');
const categoryCollection=require('../db').db().collection('categories');
const workCollection =require('../db').db().collection('works')
const serviceCollection =require('../db').db().collection('service_category')
const settingCollection =require('../db').db().collection('settings')

const blogCollection=require('../db').db().collection('posts');
const aboutCollection=require('../db').db().collection('about');


exports.index=async function(req,res){
    res.render('backend/index',{
        userEmail:req.session.user.email,
        settings : await settingCollection.findOne(),
        works : await workCollection.find().toArray(),
        posts : await blogCollection.find().toArray(),
        categories : await categoryCollection.find().toArray(),
        services : await serviceCollection.find().toArray()


    })
}
   
   exports.register=function(req,res){
        res.render('backend/register',{
            errors : req.flash('regError')
        })

    }
    exports.login=function(req,res){
        res.render('backend/login',{
            errors:req.flash('loginError'),
            middleError :req.flash('middleError')
        })
    }
    exports.blank=function(req,res){
        res.render('backend/blank')
    }
    exports.create_user=function(req,res){
       let user =new User(req.body)
       user.add().then(()=>{
           res.redirect("/admin/login")
       }).catch((err)=>{
           req.flash('regError',err);
           req.session.save(function(){
               res.redirect('/admin/register')
           })
       })
    }
    exports.retrieve_user=function(req,res){
        let user = new User(req.body)
        user.retrieve().then(()=>{
            req.session.user={email:user.data.email,favColor:"Red"}
            req.session.save(function(){
                res.redirect('/admin')
            })
            
        }).catch((err)=>{
            req.flash('loginError',err);
            req.session.save(function(){
                res.redirect('/admin/login')
            })     
        })
    }
    exports.logout = function(req,res){
        req.session.destroy(function(){
            res.redirect('/admin/login')
        })
    }

    exports.is_already_auth=function(req,res,next){
        if(req.session.user){
            res.redirect('/admin')

        }else{
            next()
        }
    }
    exports.isAuthenticated= function(req,res,next){
        if(req.session.user){
            next()
        }else{
            req.flash('middleError','Sorry but you do not have access')
            req.session.save(function(){
                res.redirect('/admin/login')
            })
            
        }
    }
    exports.check_if_there_is_a_user=async function(req,res,next){
        let user = await userCollection.findOne()
 
        if(!user){
            res.redirect('/admin/register')
        }else{
            req.flash('middleError','Sorry but there is already a user ')
            req.session.save(function(){
                res.redirect('/admin/login')
            })
           
        }
    }
    exports.menu = async function(req,res){
        res.render('backend/menu',{
            menus : await menuCollection.find().toArray(),
            settings : await settingCollection.findOne()
        })
    }

    exports.menu_create=function(req,res){
        res.render('backend/create_menu',{
            logs:req.flash('create_errors','something went wrong')

        })
    }
    exports.menu_create_post= function(req,res){
       let menu = new Menu(req.body)
       menu.add().then(()=>{
           res.redirect('/admin/menu')
       }).catch(()=>{
           req.flash('create_errors','something went wrong')
           req.session.save(function(){
            res.redirect('/admin/menu/create')

           })
       })
    }

    exports.menu_edit =function(req,res){
        let menu= new Menu(req.body,req.params.id)
        menu.edit().then((result)=>{
            res.render('backend/edit_menu',{
                menu : result
            })
            
        }).catch((err)=>{
            console.log(err)
            res.send('404 errors')
        })
    }
    exports.menu_edit_post =function(req,res){
        let menu = new Menu(req.body,req.params.id)
        menu.edit_post().then(()=>{
            res.redirect('/admin/menu')
        }).catch(()=>{
            res.redirect('/admin/menu/'+req.params.id+'/edit')
        })
    }

    exports.menu_delete=async function(req,res){
        await menuCollection.deleteOne({_id : ObjectId(req.params.id)})
        res.redirect('/admin/menu')
    }



    exports.categories = async function(req,res){
        res.render('backend/category',{
            categories : await categoryCollection.find().toArray(),
            settings : await settingCollection.findOne()
        })
    }

    exports.categories_create=function(req,res){
        res.render('backend/create_category',{
            logs:req.flash('create_errors','something went wrong')

        })
    }
    exports.categories_create_post= function(req,res){
       let category = new Category(req.body)
       category.add().then(()=>{
           res.redirect('/admin/categories')
       }).catch(()=>{
           req.flash('create_errors','something went wrong')
           req.session.save(function(){
            res.redirect('/admin/categories/create')

           })
       })
    }

    exports.categories_edit =function(req,res){
        let category= new Category(req.body,req.params.id)
        category.edit().then((result)=>{
            res.render('backend/edit_category',{
                category : result
            })
            
        }).catch((err)=>{
            console.log(err)
            res.send('404 errors')
        })
    }
    exports.categories_edit_post =function(req,res){
        let category = new Category(req.body,req.params.id)
        category.edit_post().then(()=>{
            res.redirect('/admin/categories')
        }).catch(()=>{
            res.redirect('/admin/categories/'+req.params.id+'/edit')
        })
    }

    exports.categories_delete=async function(req,res){
        await categoryCollection.deleteOne({_id : ObjectId(req.params.id)})
        res.redirect('/admin/categories')
    }


    exports.portfolio=async function(req,res){
        res.render('backend/portfolio',{
            works : await workCollection.aggregate([
                {
                    $lookup : {
                        from : "categories",
                        localField : "category_id",
                        foreignField : "_id",
                        as : "category"
                    }
                }
            ]).toArray() ,
            settings : await settingCollection.findOne()
        })
    }

    exports.portfolio_create=async function(req,res){
        res.render('backend/portfolio_create',{
            categories : await categoryCollection.find().toArray()
        })
    }

    exports.portfolio_create_post=function(req,res){
        let work =new Work(req.body,req.files)
        work.add().then(()=>{
            res.redirect('/admin/portfolio')
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.portfolio_edit=function(req,res){
        let work = new Work(req.body, req.files , req.params.id)
        work.edit().then(async(result)=>{
            res.render('backend/portfolio_edit',{
                categories : await categoryCollection.find().toArray(),
                work : result
            })
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.portfolio_edit_post=function(req,res){
        let work = new Work(req.body,req.files,req.params.id)
        work.edit_post().then(async()=>{
            res.redirect('/admin/portfolio')
        }).catch(()=>{
            res.redirect('/admin/portfolio/'+req.params.id+'/edit')
        })
    }

    exports.portfolio_delete=async function(req,res){
        await workCollection.deleteOne({_id : ObjectId(req.params.id)})
        res.redirect('/admin/portfolio')
    }
    exports.portfolio_edit_cover=async function(req,res){
        res.render('backend/edit_cover',{
            work : await workCollection.findOne({_id : ObjectId(req.params.id)})
        })
    }

    exports.portfolio_edit_cover_post = function(req,res){
             let upload = new Work(req.body,req.files,req.params.id)
             upload.up().then(()=>{
                 res.redirect('/admin/portfolio')
             }).catch(()=>{
                 res.send('404')
        })
    }

    exports.about =async function(req,res){
        res.render('backend/about',{
            about : await aboutCollection.findOne()
        })

    }

    exports.blog =async function(req,res){
        res.render('backend/blog',{
            
                posts : await blogCollection.aggregate([
                    {
                        $lookup : {
                            from : "categories",
                            localField : "category_id",
                            foreignField : "_id",
                            as : "category"
                        }
                    }
                ]).toArray(),
                settings : await settingCollection.findOne()
            
        })

    }
    exports.blog_create = async function(req,res){
        res.render('backend/blog_create',{
            categories : await categoryCollection.find().toArray()

        })
    }
    exports.blog_create_post = async function(req,res){
        let post = new Blog(req.body,req.file)
        post.create().then(async()=>{
            res.redirect('/admin/blog')
        }).catch(()=>{
            res.send('404')
        })

    }
    exports.blog_delete=async function(req,res){
        await blogCollection.deleteOne({_id : ObjectId(req.params.id)})
        res.redirect('/admin/blog')
    }
    exports.blog_edit_cover=async function(req,res){
        res.render('backend/blog_edit_cover',{
            post : await blogCollection.findOne({_id : ObjectId(req.params.id)})
        })
    }
    exports.blog_edit_cover_post=function(req,res){
        let post= new Blog(req.body,req.file,req.params.id)
        post.up().then(async()=>{
            res.redirect('/admin/blog')
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.blog_edit= async function(req,res){
        res.render('backend/blog_edit',{
                post : await blogCollection.findOne({_id : ObjectId(req.params.id)}),
                categories : await categoryCollection.find().toArray()
        })
    }

    exports.blog_edit_post = async function(req,res){
        let post = new Blog(req.body,req.file,req.params.id)
        post.edit().then(async()=>{
            res.redirect('/admin/blog')
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.about_post = async function(req,res){
        let post = new About(req.body,req.file,req.params.id)
        post.create().then(async()=>{
            res.redirect('/admin/about')
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.service=async function(req,res){
        res.render('backend/service',{
            services : await serviceCollection.find().toArray(),
            settings : await settingCollection.findOne()
        })
    }

    exports.service_create=async function(req,res){
        res.render('backend/service_create',{
            services : await serviceCollection.find().toArray()
        })
    }

    exports.service_create_post=function(req,res){
        let service =new Service(req.body)
        service.create().then(()=>{
            res.redirect('/admin/service')
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.service_edit=function(req,res){
        let service = new Service(req.body,req.params.id)
        service.edit().then(async(result)=>{
            res.redirect('backend/service_edit',{
                services : await serviceCollection.find().toArray(),
                service : result
            })
        }).catch(()=>{
            res.send('404')
        })
    }

    exports.service_edit_post=function(req,res){
        let service = new Service(req.body,req.files,req.params.id)
        service.edit_post().then(async()=>{
            res.redirect('/admin/service')
        }).catch(()=>{
            res.redirect('/admin/service/'+req.params.id+'/edit')
        })
    }

    exports.service_delete=async function(req,res){
        await serviceCollection.deleteOne({_id : ObjectId(req.params.id)})
        res.redirect('/admin/service')
    }
   
    exports.settings=async function(req,res){
        res.render('backend/settings',{
            settings : await settingCollection.findOne()
            
        })
    }
    exports.settings_post=function(req,res){
        let set = new Setting(req.body,req.file)
        set.edit().then(async(result)=>{
            res.redirect('/admin/settings')
        }).catch(()=>{
            res.send('404')
        })
    }