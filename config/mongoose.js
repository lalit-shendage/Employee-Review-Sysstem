require('dotenv').config();

const mongoose = require('mongoose');


mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db= mongoose.connection

db.on('error', console.error.bind(console,'Error connectiong database'))

db.once('open',function(){
    console.log('connected to database ')
})

module.exports=db;