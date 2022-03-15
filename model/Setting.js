
const settingCollection =require('../db').db().collection('settings')


const Setting = function(data,logo){
    this.data=data
    this.image=logo
}

Setting.prototype.edit=function(){
    return new Promise(async(resolve,reject)=>{

        await settingCollection.updateOne({},{
            $set : {
                facebook : this.data.facebook,
                instagram :this.data.instagram,
                dribble :this.data.dribble,
                footer :this.data.footer,
                logo :this.image
    
            }
        })
        resolve()
    })

}

module.exports=Setting