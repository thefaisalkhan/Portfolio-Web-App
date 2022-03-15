const { resolveInclude } = require('ejs');
const ObjectId = require('mongodb').ObjectId

const serviceCollection=require('../db').db().collection('service_category');


const Service = function(service,ServiceId){
    this.service=service
    this.ServiceId=ServiceId
}
Service.prototype.create=function(){
    return new Promise(async(resolve,reject)=>{
        this.service={
            category_id : ObjectId(this.service.category_id),
            category :this.service.category,
            name : this.service.name
        }
        await serviceCollection.insertOne(this.service)
        resolve()
    })
    
}


Service.prototype.edit=function(){
    return new Promise(async(resolve,reject)=>{
        let make_sur = await serviceCollection.findOne({_id : ObjectId(this.ServiceId)})
        if(make_sur){
            resolve(make_sur)
        }else{
            reject('not Found')
        }
    })
}

Service.prototype.edit_post=function(){
    return new Promise(async(resolve,reject)=>{
        await serviceCollection.updateOne({_id : ObjectId(this.ServiceId)},{
             $set :
             {
                category_id : ObjectId(this.service.category_id),
                category : this.service.category,
                name : this.service.name,
                
            }
        })
        resolve()
    })
}





module.exports= Service