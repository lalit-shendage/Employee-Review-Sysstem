const mongoose= require('mongoose')

const userSchema =new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ["admin", "User"],
        default: "User",
      },
    //   reviewer
      to : [    
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
        }
    ],
    // review reciever
    from : [    
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review',
        }
    ]
},
{
    timestamps:true
    
})

userSchema.methods.verifyPassword =async function(password) {
    const result=await (password===this.password)
    console.log(result, "password compare")
    return result
  };

const User=mongoose.model('User', userSchema)

module.exports =User;