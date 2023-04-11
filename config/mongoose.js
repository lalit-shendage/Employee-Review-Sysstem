require('dotenv').config();

const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://Lalit:12345@cluster0.dwnwv8t.mongodb.net/ERS", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db= mongoose.connection

db.on('error', console.error.bind(console,'Error connectiong database'))

db.once('open',function(){
    console.log('connected to database ')
})

module.exports=db;