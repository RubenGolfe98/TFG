var model = require('./model_mongo');
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log('authorize ' + req.method + ' ' + req.originalUrl);
    
    /* Authorization */
    if ((req.path == '/hospitalServices/sessions' && req.method == 'POST')) {
        console.log("asdasd")
        next();
    } else if (!req.query.token) res.status(401).send('Token not found');
    else next();
});

// LOGIN
app.post('/hospitalServices/sessions', function (req, res) {
    console.log('login ' + JSON.stringify(req.body));
    if (!req.body.id || !req.body.password)
        res.status(400).send('Parameters missing');
    else {
        model.login(req.body.id, req.body.password, (err, token, user) => {
            if (err) {
                console.log(err.stack);
                res.status(400).send(err);
            } else {
                res.send({ token: token, user: user });
            }
        });
    }
});

console.log("=============[SERVER STARTED]=============")
app.listen(8081)