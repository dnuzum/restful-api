var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var User = require("./models/user")

var app = express();

var secret = "this_is_my_treehouse_go_away";

mongoose.connect('mongodb://localhost:27017/coffeedb');

app.use("/api/users", expressJWT(
    {
        secret: secret
    }
).unless({method: "POST"}));

app.use("/api/coffees", expressJWT(
    {
        secret: secret
    }
).unless({method: "POST"}));

app.use(bodyParser.urlencoded({extended:true}));
app.use('/api/users', require('./controllers/users'));
app.use('/api/coffees', require('./controllers/coffees'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post("/api/auth", function (req, res) {
    User.findOne(
        {
            email: req.body.email
        },
        function (err, user) {
            if (err || !user) {
                res.send({message: "user not found"});
            } else {
                user.authenticated(req.body.password, function (err, result){
                    if (err || !result) {
                        res.send({
                            message: "Wrong password, bozo"
                        });
                    } else {
                        var token = jwt.sign(user, secret);
                        res.send({
                            user: user,
                            token: token
                        });
                    }
                });
            }
        }
    );
});

app.listen(3000);