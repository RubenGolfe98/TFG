var model = require('./model_mongo');
const port = 8081;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
    console.log('authorize ' + req.method + ' ' + req.originalUrl);
    
    /* Authorization */
    if ((req.path == '/hospitalServices/sessions' && req.method == 'POST')||
        (req.path == '/hospitalServices/pacientes' && req.method == 'POST')) {
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
        model.login(req.body.id, req.body.password, req.body.esSanitario, (err, token, user) => {
            if (err) {
                console.log(err.stack);
                res.status(400).send(err);
            } else {
                res.send({ token: token, user: user });
            }
        });
    }
});

// ADD PACIENTE
app.post('/hospitalServices/pacientes', function (req, res) {
    console.log('add paciente ' + JSON.stringify(req.body.user));
    model.addPaciente(req.body.user, (err, user) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else res.send(user);
    });
});

//GET PACIENTES
app.get('/hospitalServices/pacientes', function (req, res) {
    console.log('list pacientes');
    model.listaPacientesPorSanitario(req.query.token, req.query.dni, (err, pacientes) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(pacientes);
        }
    });
});

app.listen(port, () =>{
    console.log(`=============[SERVER STARTED p:${port}]=============`);
});