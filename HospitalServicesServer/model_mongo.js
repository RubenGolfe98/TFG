const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const DB_NAME = 'hospitalAlcoy'

const USERS_COLLECTION = 'usuarios'


/*
let cb = (err, res)=>console.log(err? `ERROR: ${err.stack}` : `SUCCESS: ${JSON.stringify(res)}`)
pacientes = listaPacientesPorSanitario("640c50505fa94d58cf9f39bd", "87654321B", cb)
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
function login(dni, password, esSanitario, cb) {
    console.log('login(' + dni + ', ' + password + ', ' + cb + ')');

    MongoClient.connect(url).then(client => {
        _cb = function (err, res, res2) {
            client.close();
            cb(err, res, res2);
        }
        let db = client.db(DB_NAME);
        let col = db.collection(USERS_COLLECTION);
        col.findOne({ dni: dni, password: password, esSanitario: esSanitario}).then(_user => {
            if (!_user) _cb(new Error('Wrong authentication'));
            else {
                _cb(null, _user._id.toHexString(), {
                    id: _user._id.toHexString(), nombre: _user.nombre, apellido1: _user.apellido1,
                    dni: _user.dni, apellido2: _user.apellido2, esSanitario: _user.esSanitario
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
            users.findOne({dni: user.dni}).then(
                (_user) => {
                    if (_user) _cb(new Error('El paciente ya existe'));
                    else {
                        users.insertOne(user).then(result => {
                            _cb(null, {
                                id: result.insertedId.toHexString(), dni: user.dni,
                                nombre: user.nombre, apellido1: user.apellido1, apellido2: user.apellido2,
                                password: user.password, esSanitario:user.esSanitario, doctores:user.doctores, fechaDeAlta: user.fechaDeAlta
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
                users.find({dni: dni}).toArray().then(_result => {
                    if (!_result) _cb(new Error("The user doesn't exist"))
                    else {
                        let pacientes = _result[0]["pacientes"]
                        if(pacientes!=[]){
                            users.find({dni:{$in:pacientes}},{dni:1,nombre:1,apellido1:1,apellido2:1,fechaDeAlta:1}).toArray().then(_res =>{
                                if (!_res) _cb(null, [])
                                else{
                                    _cb(null, _res);
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                        }
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
}

module.exports = {
    login,
    listaPacientesPorSanitario,
    addPaciente
}