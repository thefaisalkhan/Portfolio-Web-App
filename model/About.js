const { resolveInclude } = require('ejs');
const ObjectId = require('mongodb').ObjectId

const aboutCollection=require('../db').db().collection('about');


const About = function(about){
    this.about=about
}

About.prototype.create=function(){
    return new Promise(async(resolve,reject)=>{
        await aboutCollection.updateOne({},{$set :{
            heading : this.about.heading,
            subheading :this.about.subheading,
            content : this.about.content
        }})
        resolve()
    })

}

module.exports= About