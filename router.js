const express = require('express')
const router=express.Router()
const userController=require('./controller/userController')
const backendController=require('./controller/backendController')


const multer=require('multer')
const upload = multer({ dest: 'uploads/' })

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })


//userController ROuter
router.get('/',userController.index)
router.get('/portfolio',userController.index)
router.get('/blog',userController.blog)
router.get('/about',userController.about)
router.get('/contact',userController.get_contact)
router.post('/contact',userController.contact)


//back controller router
router.get('/admin',backendController.isAuthenticated,backendController.index)
router.get('/admin/register',backendController.check_if_there_is_a_user,backendController.register)
router.post('/admin/register',backendController.check_if_there_is_a_user,backendController.create_user)
router.post('/admin/logout',backendController.logout)
router.get('/admin/login',backendController.is_already_auth,backendController.login)
router.post('/admin/login',backendController.is_already_auth,backendController.retrieve_user)
router.get('/admin/menu',backendController.isAuthenticated,backendController.menu)
router.get('/admin/menu/create',backendController.isAuthenticated,backendController.menu_create)
router.post('/admin/menu/create',backendController.isAuthenticated,backendController.menu_create_post)
router.get('/admin/menu/:id/edit',backendController.isAuthenticated,backendController.menu_edit)
router.post('/admin/menu/:id/edit',backendController.isAuthenticated,backendController.menu_edit_post)
router.get('/admin/menu/:id/delete',backendController.isAuthenticated,backendController.menu_delete)


router.get('/admin/categories',backendController.isAuthenticated,backendController.categories)
router.get('/admin/categories/create',backendController.isAuthenticated,backendController.categories_create)
router.post('/admin/categories/create',backendController.isAuthenticated,backendController.categories_create_post)
router.get('/admin/categories/:id/edit',backendController.isAuthenticated,backendController.categories_edit)
router.post('/admin/categories/:id/edit',backendController.isAuthenticated,backendController.categories_edit_post)
router.get('/admin/categories/:id/delete',backendController.isAuthenticated,backendController.categories_delete)
router.get('/admin/portfolio',backendController.isAuthenticated,backendController.portfolio)
router.get('/admin/portfolio/create',backendController.isAuthenticated,backendController.portfolio_create)
router.post('/admin/portfolio/create',backendController.isAuthenticated,upload.fields([{ name : 'cover', maxCount : 1 } , { name :'images' , maxCount: 12}]),backendController.portfolio_create_post)
router.get('/admin/portfolio/:id/edit',backendController.isAuthenticated,backendController.portfolio_edit)
router.post('/admin/portfolio/:id/edit',backendController.isAuthenticated,backendController.portfolio_edit_post)
router.get('/admin/portfolio/:id/delete',backendController.isAuthenticated,backendController.portfolio_delete)
router.get('/admin/portfolio/:id/edit_cover',backendController.isAuthenticated,backendController.portfolio_edit_cover)
router.post('/admin/portfolio/:id/edit_cover',backendController.isAuthenticated,upload.fields([{ name : 'cover', maxCount : 1 } , { name :'images' , maxCount: 12}]),backendController.portfolio_edit_cover_post)
router.get('/admin/blog',backendController.isAuthenticated,backendController.blog)
router.get('/admin/blog/create',backendController.isAuthenticated,backendController.blog_create)
router.post('/admin/blog/create',backendController.isAuthenticated,upload.single('cover'),backendController.blog_create_post)
router.get('/admin/blog/:id/delete',backendController.isAuthenticated,backendController.blog_delete)
router.get('/admin/blog/:id/edit',backendController.isAuthenticated,backendController.blog_edit)
router.post('/admin/blog/:id/edit',backendController.isAuthenticated,backendController.blog_edit_post)
router.get('/admin/blog/:id/edit_cover',backendController.isAuthenticated,backendController.blog_edit_cover)
router.post('/admin/blog/:id/edit_cover',backendController.isAuthenticated,upload.single('cover'),backendController.blog_edit_cover_post)
router.get('/admin/about',backendController.isAuthenticated,backendController.about)
router.post('/admin/about',backendController.isAuthenticated,backendController.about_post)
router.get('/admin/service',backendController.isAuthenticated,backendController.service)
router.get('/admin/service/create',backendController.isAuthenticated,backendController.service_create)
router.post('/admin/service/create',backendController.isAuthenticated,backendController.service_create_post)
router.get('/admin/service/:id/edit',backendController.isAuthenticated,backendController.service_edit)
router.post('/admin/service/:id/edit',backendController.isAuthenticated,backendController.service_edit_post)
router.get('/admin/service/:id/delete',backendController.isAuthenticated,backendController.service_delete)
router.get('/admin/settings',backendController.isAuthenticated,backendController.settings)
router.post('/admin/settings',backendController.isAuthenticated,upload.single('logo'),backendController.settings_post)



module.exports=router


