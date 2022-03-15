const ObjectId = require('mongodb').ObjectId
const workCollection =require('../db').db().collection('works')

const Work=function(work,images,Workid){
    this.work=work
    this.images=images
    this.Workid=Workid
}
let date =new Date()
Work.prototype.add=function(){
   return new Promise(async(resolve,reject)=>{
    this.work={
        category_id : ObjectId(this.work.category_id),
        title : this.work.title,
        description : this.work.description,
        images : this.images,
        created_at : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours()+ ":" + date.getMinutes()+ ":" + date.getSeconds(),
        updated_at : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours()+ ":" + date.getMinutes()+ ":" + date.getSeconds() 
     }
     await workCollection.insertOne(this.work)
     resolve()
   })
}

Work.prototype.edit=function(){
    return new Promise(async(resolve,reject)=>{
        let make_sur = await workCollection.findOne({_id : ObjectId(this.Workid)})
        if(make_sur){
            resolve(make_sur)
        }else{
            reject('not Found')
        }
    })
}

Work.prototype.edit_post=function(){
    return new Promise(async(resolve,reject)=>{
        await workCollection.updateOne({_id : ObjectId(this.Workid)},{ $set :
             {
                category_id : ObjectId(this.work.category_id),
                title : this.work.title,
                description : this.work.description,

             }
        })
        resolve()
    })
}

Work.prototype.up = function(){
    return new Promise(async(resolve,reject)=>{
        await workCollection.updateOne({_id: ObjectId(this.Workid)}, {$set:{
            images : this.files
        }})


        resolve()
    })
}

module.exports = Work