
const mongodb = require('mongodb').MongoClient
const dotenv=require('dotenv').config()
mongodb.connect(process.env.CONNECTION,{useNewUrlParser: true,useUnifiedTopology: true},function(err,client){
if(err){
    console.log(err)
}else{
    module.exports=client
    const app=require('./app')
    app.listen(process.env.PORT,function(req,res){
        console.log('connected')
    })
}
})