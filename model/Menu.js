const { resolveInclude } = require('ejs');

const menuCollection=require('../db').db().collection('menus');
const ObjectId = require('mongodb').ObjectId
const Menu = function(menu,menuId){

    this.menu=menu
    this.errors=[]
    this.menuId=menuId
}
Menu.prototype.validate=function(){
    if(this.menu.name==""){this.errors.push("Menu name field should not be empty")}
    if(this.menu.slug==""){this.errors.push("Slug name field should not be empty")}

}
Menu.prototype.add=function(){
    return new Promise(async(resolve,reject)=>{
       this.validate()
       if(this.errors.length){
        reject(this.errors)
       }else{
        this.menu={
            name:this.menu.name,
            slug:this.menu.slug
        }
        await menuCollection.insertOne(this.menu)
        resolve()

       }
    })
}
Menu.prototype.edit=function(){
    return new Promise(async(resolve,reject)=>{
        let find_menu_by_id=await menuCollection.findOne({_id : ObjectId(this.menuId)})
        if(find_menu_by_id){
            resolve(find_menu_by_id)
        }else{
            reject('there is no object id specified')
        }
    })
}
Menu.prototype.edit_post=function(){
    return new Promise(async(resolve,reject)=>{
        await menuCollection.updateOne({_id : ObjectId(this.menuId)},{ $set :
             {
                 name : this.menu.name,
                 slug: this.menu.slug
             }
        })
        resolve()
    })
}
module.exports= Menu