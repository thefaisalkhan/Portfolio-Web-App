const { resolveInclude } = require('ejs');
const ObjectId = require('mongodb').ObjectId

const blogCollection=require('../db').db().collection('posts');


const Blog = function(post,cover,PostId){
    this.post=post
    this.image=cover
    this.PostId=PostId
}
let date =new Date()
Blog.prototype.create=function(){
    return new Promise(async(resolve,reject)=>{
        this.post={
            category_id : ObjectId(this.post.category_id),
            title : this.post.title,
            content : this.post.description,
            tags : this.post.tags,
            cover:this.image,
            created_at : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours()+ ":" + date.getMinutes()+ ":" + date.getSeconds(),
            updated_at : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours()+ ":" + date.getMinutes()+ ":" + date.getSeconds() 
         
        }
        await blogCollection.insertOne(this.post)
        resolve()
    })
    
}


Blog.prototype.edit=function(){
    return new Promise(async(resolve,reject)=>{
        await blogCollection.updateOne({_id : ObjectId(this.PostId)},{
             $set :
             {
                category_id : ObjectId(this.post.category_id),
                title : this.post.title,
                content : this.post.content,
                tags : this.post.tags,
                updated_at : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours()+ ":" + date.getMinutes()+ ":" + date.getSeconds() 

             }
        })
        resolve()
    })
}

Blog.prototype.up = function(){
    return new Promise(async(resolve,reject)=>{
        await blogCollection.updateOne({_id: ObjectId(this.Postid)}, {$set:{
            cover : this.image
        }})


        resolve()
    })
}
module.exports= Blog