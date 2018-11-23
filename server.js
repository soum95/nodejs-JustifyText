const express=require("express");
 const app= express();
 const bodyParser=require('body-parser');
 var path = require('path');
 const jwt=require('jsonwebtoken');
 var {mongoose,rateLimite,nbCharMax} = require('./db');
 const User=require('./model/user');
const totalWords=('./control/totalWords');
 const verifyToken=('./control/verifyToken');
 var hbs = require('express-handlebars');
 const PORT = process.env.PORT || 5000;
 const ApiR = express.Router();
let limit={};
let t="";
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.get('/', function(req, res,next) {

   res.render('index');

});

ApiR.post('/token', function(req, res) {

     User.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. email not found.' });
        } else {

            const payload = {
                email: user.email
            };
            const token = jwt.sign(payload, 'secret', {
                expiresIn: 86400
            });
            limit[token] = {words : 0, date: new Date()};
   res.json({
                success: true,
                token: token
            });
        }
    });

});

 

 ApiR.post('/justify',(req, res) =>{
    if(verifyToken){
    
     if(totalWords > rateLimite)
     res.status(402).json({ success: false, message: '402 Payment Required.' });
     else {
        const tab = req.body.split(/\n|\s/);
        let i = 0;
        let text = [""];

        tab.forEach((word) => {
            if (text[i].length + word.length <= nbCharMax) {
                text[i] += word+ ' ';
            } else {
                text[i] = text[i].substr(0, text[i].length - 1);
                if (text[i].length !== nbCharMax) {
                    let reste = nbCharMax - text[i].length;
                    const re = /\s/g;
                    let spacebetween = [];
                    while ((match = re.exec(text[i])) !== null) {
                        spacebetween.push(match.i);
                    }
                    spacebetween = spacebetween.reverse();
                    let j = 0;
                    while (reste > 0) {
                        text[i] = text[i].split('');
                        text[i].splice(spacebetween[j], 0, ' ');
                        text[i] = text[i].join('');
                        j++;
                        reste--;
                    }
                }
                i++;
                text[i] = "";
                text[i] += word + ' ';
            }
        });
        text[i] = text[i].substr(0, text[i].length - 1);
        text = text.join("\n");
        return res.send(text);
    }
    }
});

 
app.use('/api', ApiR);



app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
