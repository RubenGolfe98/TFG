const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const DB_NAME = 'hospitalAlcoy'

const USERS_COLLECTION = 'usuarios'


/*
let cb = (err, res)=>console.log(err? `ERROR: ${err.stack}` : `SUCCESS: ${JSON.stringify(res)}`)
listaPacientesPorSanitario("64340415b6dd33ef999ec4a5", "75214839C", cb)
    TESTS
login("1234","1234", cb)
listaPacientesPorSanitario("64340415b6dd33ef999ec4a5", "75214839C", cb)
let user = {dni: "01010101A",
            nombre: "PruebaNombre",
            apellido1: "Ape1",
            apellido2: "Ape2",
            password: "password"}
addPaciente(user, cb)
*/
function login(id, password, esSanitario, cb) {
    console.log('login(' + id + ', ' + password + ', ' + cb + ')');

    MongoClient.connect(url).then(client => {
        _cb = function (err, res, res2) {
            client.close();
            cb(err, res, res2);
        }
        let db = client.db(DB_NAME);
        let col = db.collection(USERS_COLLECTION);
        col.findOne({ id: id, password: password, esSanitario: esSanitario}).then(_user => {
            if (!_user) _cb(new Error('Wrong authentication'));
            else {
                _cb(null, _user._id.toHexString(), {
                    id: _user._id.toHexString(), nombre: _user.nombre, apellido1: _user.apellido1,
                    id: _user.id, apellido2: _user.apellido2, esSanitario: _user.esSanitario
                });
            }
        }).catch(err => {
            _cb(err)
        });
    }).catch(err => {
        cb(err);
    });
}

function addPaciente(user, cb) {
    if (!user.nombre) cb(new Error('Name missing'));
    else if (!user.dni) cb(new Error('DNI missing'));
    else if (!user.apellido1) cb(new Error('First surname missing'));
    else if (!user.apellido2) cb(new Error('Second surname missing'));
    else if (!user.password) cb(new Error('Property password missing'));
    else {
        MongoClient.connect(url).then((client) => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }
            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);
            users.findOne({id: user.dni}).then(
                (_user) => {
                    if (_user) _cb(new Error('El paciente ya existe'));
                    else {
                        users.insertOne(user).then(result => {
                            _cb(null, {
                                id: result.insertedId.toHexString(), id: user.dni,
                                nombre: user.nombre, apellido1: user.apellido1, apellido2: user.apellido2,
                                password: user.password
                            });
                        }).catch(err => {
                            _cb(err)
                        });
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function listaPacientesPorSanitario(token, dni, cb) {
    let dniPacientes = []
    let pacientes = {}
    MongoClient.connect(url).then(client => {
        // create new callback for closing connection
        _cb = function (err, res) {
            client.close();
            cb(err, res);
        }
        let db = client.db(DB_NAME);
        let users = db.collection(USERS_COLLECTION);
        users.findOne({ _id: new mongodb.ObjectId(token) }).then(_user => {
            if (!_user) _cb(new Error('Wrong token'));
            else {
                users.find({id: dni}).toArray().then(_result => {
                    if (!_result) _cb(new Error("The user doesn't exist"))
                    else {
                        dniPacientes = _result[0]["pacientes"]
                        return dniPacientes
                    }
                }).catch(err => {
                    _cb(err)
                });
            }
        }).catch(err => {
            _cb(err)
        });
    }).catch(err => {
        cb(err);
    });

    if(dniPacientes!=[]){
        dniPacientes.forEach(function(dniPaciente) {
            MongoClient.connect(url).then(client => {
                // create new callback for closing connection
                _cb = function (err, res) {
                    client.close();
                    cb(err, res);
                }
                let db = client.db(DB_NAME);
                let users = db.collection(USERS_COLLECTION);
                users.findOne({id: dniPaciente}).then(_paciente => {
                    if (_paciente) 
                        paciente = _paciente[0]
                    
                }).catch(err => {
                    _cb(err)
                });
            }).catch(err => {
                cb(err);
            });    
        });
    }
    cb(null, pacientes)
}

module.exports = {
    login,
    listaPacientesPorSanitario,
    addPaciente
}