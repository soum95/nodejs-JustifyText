var mongoose = require('mongoose');
 const rateLimite = 80000;
 const  nbCharMax= 80;
var mongoDB='mongodb://soumaya:tictactrip2018@ds127321.mlab.com:27321/api';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db =mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = {mongoose,rateLimite,nbCharMax};