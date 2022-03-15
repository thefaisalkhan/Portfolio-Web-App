const { resolveInclude } = require('ejs');

const categoryCollection=require('../db').db().collection('categories');


const ObjectId = require('mongodb').ObjectId
const Category = function(category,categoryId){

    this.category=category
    this.errors=[]
    this.categoryId=categoryId
}
Category.prototype.validate=function(){
    if(this.category.name==""){this.errors.push("Menu name field should not be empty")}
    if(this.category.slug==""){this.errors.push("Slug name field should not be empty")}

}
Category.prototype.add=function(){
    return new Promise(async(resolve,reject)=>{
       this.validate()
       if(this.errors.length){
        reject(this.errors)
       }else{
        this.category={
            name:this.category.name,
            slug:this.category.slug
        }
        await categoryCollection.insertOne(this.category)
        resolve()

       }
    })
}
Category.prototype.edit=function(){
    return new Promise(async(resolve,reject)=>{
        let find_category_by_id=await categoryCollection.findOne({_id : ObjectId(this.categoryId)})
        if(find_category_by_id){
            resolve(find_category_by_id)
        }else{
            reject('there is no object id specified')
        }
    })
}
Category.prototype.edit_post=function(){
    return new Promise(async(resolve,reject)=>{
        await categoryCollection.updateOne({_id : ObjectId(this.categoryId)},{ $set :
             {
                 name : this.category.name,
                 slug: this.category.slug
             }
        })
        resolve()
    })
}
module.exports= Category