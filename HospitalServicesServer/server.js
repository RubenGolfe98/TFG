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
    console.log(req.query);
    console.log(req.body);

    /* Authorization */
    if ((req.path == '/hospitalServices/sessions' && req.method == 'POST')||
        (req.path == '/hospitalServices/pacientes' && req.method == 'POST')) {
        next();
    } else if (!req.query.token && !req.body.token && !req.body.params.token) res.status(401).send('Token not found');
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
    model.addPaciente(req.body.token, req.body.user, (err, user) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else res.send(user);
    });
});

// UPDATE USER
app.put('/hospitalServices/user/:id', function (req, res) {
    console.log('update user ' + JSON.stringify(req.body));
    model.updatePassword(req.body.token, req.body.password, (err, user) => {
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

// ADD SERVICIO
app.post('/hospitalServices/servicios', function (req, res) {
    console.log('add servicio ' + JSON.stringify(req.body.params.servicio));
    model.addServicio(req.body.params.token, req.body.params.servicio, req.body.params.dniSanitario, (err, servicio) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(servicio);
        }
    });
});

// GET SERVICIOS RESPONSABLES DEL SANITARIO
app.get('/hospitalServices/sanitarios/:dniSanitario/servicios', function (req, res) {
    console.log('list servicios responsables del sanitario');
    model.getServiciosSanitario(req.query.token, req.query.dniSanitario, (err, servicios) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(servicios);
        }
    });
});

// GET SERVICIOS ASIGNADOS DEL PACIENTE
app.get('/hospitalServices/pacientes/:dniPaciente/servicios/asignados', function (req, res) {
    console.log('list servicios asignados del paciente');
    model.getServiciosAsignadosPaciente(req.params.dniPaciente, req.query.opts, (err, servicios) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(servicios);
        }
    });
});

// ADD SERVICIO ASIGNADO A UN PACIENTE
app.post('/hospitalServices/servicios/asignados', function (req, res) {
    console.log('add servicio asignado a un paciente' + JSON.stringify(req.body.servicioAsignado));
    model.addServicioAsignado(req.body.params.token, req.body.params.servicioAsignado, (err, idPaciente) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(idPaciente);
        }
    });
});

//GET PACIENTES DE UN SERVICIO ASIGNADO
app.get('/hospitalServices/servicios/asignados/:idServicioAsignado', function (req, res) {
    console.log('list pacientes');
    console.log(req.query)
    console.log(req.body)
    model.getPacientesPorServicioAsignado(req.query.token, req.query.dniSanitario, req.query.idServicioAsignado, (err, pacientes) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(pacientes);
        }
    });
});

// DELETE SERVICIO ASIGNADO (BORRADO LÓGICO)
app.put('/hospitalServices/servicios/asignados/:idServicioAsignado', function (req, res) {
    console.log('update servicio asignado' + JSON.stringify(req.params.idServicioAsignado));
    model.deleteServicioAsignado(req.body.token, req.params.idServicioAsignado, (err, servicioAsignado) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(servicioAsignado);
        }
    });
});

// ADD MEDICIÓN
app.post('/hospitalServices/servicios/asignados/:idServicioAsignado/mediciones', function (req, res) {
    console.log('add medición a un servicio asignado' + JSON.stringify(req.params.idServicioAsignado));
    model.addMedicion(req.body.token, req.body.dniPaciente, req.params.idServicioAsignado, req.body.medicion, (err, medicion) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(medicion);
        }
    });
});

// DELETE MEDICION
app.delete('/hospitalServices/servicios/asignados/:idServicioAsignado/mediciones', function (req, res) {
    console.log('delete medición de un servicio asignado' + JSON.stringify(req.params.idServicioAsignado));
    model.deleteMedicion(req.body.token, req.body.dniPaciente, req.params.idServicioAsignado, req.body.medicion, (err, medicion) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(medicion);
        }
    });
});

// GET ALARMAS
app.get('/hospitalServices/alarmas', function (req, res) {
    console.log('get alarmas');
    model.getAlarmas(req.body.token, req.body.dniSanitario, (err, alarmas) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(alarmas);
        }
    });
});

// UPDATE ALARMA
app.put('/hospitalServices/alarmas/:idAlarma', function (req, res) {
    console.log('update alarma' + JSON.stringify(req.params.idAlarma));
    model.gestionarAlarma(req.body.token, req.body.alarma, (err, alarma) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else {
            res.send(alarma);
        }
    });
});

app.listen(port, () =>{
    console.log(`=============[SERVER STARTED p:${port}]=============`);
});