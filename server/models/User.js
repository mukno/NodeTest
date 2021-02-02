const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const e = require('express');
const saltRounds=10
var jwt = require('jsonwebtoken');






const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlenght:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50

    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }


})
//model에 가기 전에 실행해서 bcrypt로 비밀번호를 암호화한다
userSchema.pre('save',function(next){
    var user =this;
    //salt를 이용해서 비밀번호 암호화 slat를생성해야한다
  
    if(user.isModified('password')){
          //비밀번호를 암호화 시킨다
        bcrypt . genSalt ( saltRounds , function ( err , salt ) {               
                if(err) return next(err)

                bcrypt . hash ( user.password ,  salt , function ( err , hash ) {  
                    if(err) return next(err)
                    user.password=hash
                    next()
                    //  비밀번호 DB에 해시를 저장합니다.
                } ) ;

            

        
        } ) 
    }else{
        next()
    }


    
})

userSchema.methods.comparePassword=function(plainPassword,cb){

    //plainPassword 1234567 암호화된 비밀번호 ~!~!#!~#!~# 
    //plainPassword인 비밀번호와 암호화된 비밀번호를 복호화해서 비교가 불가능
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
            cb(null,isMatch);//true

    })




}


userSchema.methods.generateToken=function(cb){

    var user=this;

    //jsonwebtoken이용해서 toekn생성
    var token =jwt.sign(user._id.toHexString(),'secretToken')

    //user._id+'secretToken'=token
    user.token=token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)

    })


}

userSchema.statics.findByToken=function(token,cb){
    var user=this;

    

    //토큰을 decode한다. verify은 doc참조 
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        //findOne은 mongoDB 메서드
        user.findOne({"_id":decoded,"token":token},function(err,user){

            if(err) return cb(err);
            cb(null,user)
        })

    })
}


const User=mongoose.model('User',userSchema)

module.exports={User}