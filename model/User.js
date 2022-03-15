const userCollection=require('../db').db().collection('users');
const validator=require('validator')
const bcrypt=require('bcryptjs'); 
const { get } = require('express/lib/response');
const User = function(data){
     this.data=data
     this.errors=[]
}
let date = new Date()
User.prototype.validate=function(){
    if(this.data.first_name==""){this.errors.push("You Must Provide First name")}
    if(this.data.last_name==""){this.errors.push("You Must Provide Last name")}
    if(this.data.email==""){this.errors.push("You Must Provide Email")}
    if(this.data.password==""){this.errors.push("You Must Provide Password")}
    if(this.data.repeat_password==""){this.errors.push("You Must Repeat the Passwprd")}
    if(this.data.first_name.length > 0 && this.data.first_name.length > 30){this.errors.push("You First Name limit is 30 characters")}
    if(this.data.last_name.length > 0 && this.data.last_name.length > 30){this.errors.push("You Last Name limit is 30 characters")}
    if(this.data.password.length > 0 && this.data.password.length < 6){this.errors.push("Password sould be more 6 characters")}
    if(this.data.repeat_password.length > 0 && this.data.repeat_password.length < 6){this.errors.push("Password should be 6 characters")}
    if(!validator.isAlpha(this.data.first_name)){this.errors.push('First name should not be numeric')}
    if(!validator.isAlpha(this.data.last_name)){this.errors.push('Last name should not be numeric')}
    if(!validator.isEmail(this.data.email)){this.errors.push('Email is not valid')}
    if(this.data.repeat_password!=this.data.password){this.errors.push('Passwords not Matched')}
}
User.prototype.add=function(){
   return new Promise(async (resolve,reject)=>{
    this.validate()
    if(this.errors.length){
        reject(this.errors)
    }else{
        let salt = bcrypt.genSaltSync(10)
        this.data={
            first_name: this.data.first_name,
            last_name: this.data.last_name,
            email: this.data.email,
            password: bcrypt.hashSync(this.data.password,salt),
            repeat_password:  bcrypt.hashSync(this.data.repeat_password,salt)
        }
        await userCollection.insertOne(this.data)
        resolve()
    }
   })
  
}
User.prototype.cleanUp=function(){
    if(this.data.email==""){this.errors.push("You Must Provide Email")}
    if(this.data.password==""){this.errors.push("You Must Provide Password")}
    if(this.data.repeat_password==""){this.errors.push("You Must Repeat the Passwprd")}
    if(this.data.password.length > 0 && this.data.password.length < 6){this.errors.push("Password sould be more 6 characters")}
    if(!validator.isEmail(this.data.email)){this.errors.push('Email is not valid')}

}
User.prototype.retrieve=function(){
    return new Promise(async (resolve,reject) => {
        this.data={
            email:this.data.email,
            password:this.data.password,

        }
        let get_user= await userCollection.findOne()
        if(this.errors.length){
            reject(this.errors)
        }else{
            if(this.data.email == get_user.email && bcrypt.compareSync(this.data.password, get_user.password)){
                resolve()
            }else{
                reject('Invalid email /password')
            }
        }
    })
}
module.exports=User