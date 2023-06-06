const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const DB_NAME = 'hospitalAlcoy'

const USERS_COLLECTION = 'usuarios'
const SERVICIOS_COLLECTION = 'servicios'
const SERVICIOS_ASIGNADOS_COLLECTION = 'serviciosAsignados'
const ALARMAS_COLLECTION = 'alarmas'

/*
let cb = (err, res)=>console.log(err? `ERROR: ${err.stack}` : `SUCCESS: ${JSON.stringify(res)}`)
getServiciosAsignadosPaciente('640c4fbc5fa94d58cf9f39bc', '12345678A', {activo: 'true'}, cb);
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
let servicio = {
    nombre: "Cardiología",
    descripcion: "Servicio para controlar las pulsaciones por minuto",
    unidades: "Pulsaciones por minuto(ppm)"
}
addServicio(servicio, "87654321B", cb)
getServiciosSanitario("87654321B", cb)
*/

//---------------------- LOGIN
function login(dni, password, esSanitario, cb) {
    console.log('login(' + dni + ', ' + password + ', ' + cb + ')');

    MongoClient.connect(url).then(client => {
        _cb = function (err, res, res2) {
            client.close();
            cb(err, res, res2);
        }
        let db = client.db(DB_NAME);
        let col = db.collection(USERS_COLLECTION);
        col.findOne({ dni: dni, password: password, esSanitario: esSanitario }).then(_user => {
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

//---------------------- PACIENTES
function addPaciente(token, user, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!user.nombre) cb(new Error('Name missing'));
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
            users.findOne({ _id: new mongodb.ObjectId(token), esSanitario: true }).then(
                (_sanitario) => {
                    if (_sanitario) {
                        users.findOne({ dni: user.dni }).then(
                            (_user) => {
                                if (_user) _cb(new Error('El paciente ya existe'));
                                else {
                                    users.insertOne(user).then(result => {
                                        _cb(null, {
                                            id: result.insertedId.toHexString(), dni: user.dni,
                                            nombre: user.nombre, apellido1: user.apellido1, apellido2: user.apellido2,
                                            password: user.password, esSanitario: user.esSanitario, doctores: user.doctores, fechaDeAlta: user.fechaDeAlta
                                        });
                                    }).catch(err => {
                                        _cb(err)
                                    });
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                    } else {
                        _cb(new Error("Sanitario doesn't exist"))
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function updatePassword(token, newPassword, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!newPassword) cb(new Error('Paswword missing'));
    else {
        MongoClient.connect(url).then((client) => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }
            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.updateOne({ _id: new mongodb.ObjectId(token) },
                {
                    $set: {
                        "password": newPassword
                    }
                }).then(() => {
                    client.close();
                    cb();
                }).catch(err => {
                    client.close();
                    cb(err);
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function listaPacientesPorSanitario(token, dni, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!dni) cb(new Error('DNI sanitario missing'));
    MongoClient.connect(url).then(client => {
        // create new callback for closing connection
        _cb = function (err, res) {
            client.close();
            cb(err, res);
        }
        let db = client.db(DB_NAME);
        let users = db.collection(USERS_COLLECTION);
        users.findOne({ _id: new mongodb.ObjectId(token), esSanitario: true }).then(_sanitario => {
            if (!_sanitario) _cb(new Error('Wrong token'));
            else {
                users.find({ dni: dni }).toArray().then(_result => {
                    if (!_result) _cb(new Error("The user doesn't exist"))
                    else {
                        let pacientes = _result[0]["pacientes"]
                        if (pacientes != []) {
                            users.find({ dni: { $in: pacientes } }, { dni: 1, nombre: 1, apellido1: 1, apellido2: 1, fechaDeAlta: 1 }).toArray().then(_res => {
                                if (!_res) _cb(null, [])
                                else {
                                    _cb(null, _res);
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                        } else {
                            _cb(null, [])
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

function getPacientesPorServicioAsignado(token, dniSanitario, idServicio, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!dniSanitario) cb(new Error('DNI sanitario missing'));
    else if (!idServicio) cb(new Error('Servicio missing'));
    else {
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }
            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), esSanitario: true, dni: dniSanitario }).then(_sanitario => {
                if (!_sanitario) _cb(new Error('Wrong token'));
                else {
                    let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
                    serviciosAsignados.find({
                        servicio: new mongodb.ObjectId(idServicio),
                        sanitarioResponsable: dniSanitario
                    }, { paciente: 0 }).toArray().then(_servAsigns => {
                        if (!_servAsigns) _cb(null, [])
                        else {
                            let pacientes = [];
                            _servAsigns.forEach((servAsign) => {
                                pacientes.push(servAsign.paciente);
                            });
                            if (pacientes != []) {
                                users.find({ dni: { $in: pacientes }, esSanitario: false }).toArray().then(_res => {
                                    if (!_res) _cb(null, [])
                                    else {
                                        _cb(null, _res);
                                    }
                                }).catch(err => {
                                    _cb(err)
                                });
                            } else {
                                _cb(null, [])
                            }
                        }
                    }).catch(err => {
                        _cb(err)
                    });
                }
            }).catch(err => {
                cb(err);
            });
        }).catch(err => {
            cb(err);
        });
    }
}

//---------------------- SERVICIOS
async function addServicio(token, servicio, dniSanitario, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!servicio.nombre) cb(new Error('Name missing'));
    else if (!servicio.descripcion) cb(new Error('Descripción missing'));
    else if (!servicio.unidades) cb(new Error('Unidades missing'));
    else if (!dniSanitario) cb(new Error('DNI sanitario missing'));
    else {
        MongoClient.connect(url).then((client) => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }
            let db = client.db(DB_NAME);
            let servicios = db.collection(SERVICIOS_COLLECTION);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token) }).then(async _sanitario => {
                if (!_sanitario) _cb(new Error('Wrong token'));
                else {
                    const result = await servicios.insertOne(servicio);
                    console.log(result)
                    users.updateOne({ dni: dniSanitario, esSanitario: true }, { $push: { servicios: result.insertedId } }).then(_res => {
                        if (!_res) _cb(null, [])
                        else {
                            _cb(null, result.insertedId)
                        }
                    })
                }
            }).catch(err => {
                _cb(err)
            });
        }).catch(err => {
            cb(err);
        });
    }
}

function getServiciosSanitario(token, dniSanitario, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!dniSanitario) cb(new Error('DNI Sanitario missing'));
    else {
        MongoClient.connect(url).then(client => {

            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }
            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);
            users.findOne({ _id: new mongodb.ObjectId(token), dni: dniSanitario, esSanitario: true }).then(
                (_sanitario) => {
                    if (_sanitario) {
                        let serviciosSanitario = _sanitario["servicios"]
                        if (serviciosSanitario != []) {
                            let servicios = db.collection(SERVICIOS_COLLECTION);
                            servicios.find({ _id: { $in: serviciosSanitario } }).toArray().then(_res => {
                                if (!_res) _cb(null, [])
                                else {
                                    _cb(null, _res);
                                }
                            }).catch(err => {
                                _cb(err)
                            });

                        } else {
                            _cb(null, [])
                        }
                    } else {
                        _cb(new Error('El sanitario no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function getServicioAsignadoPaciente(token, dniPaciente, idServicio, cb){
    if (!token) cb(new Error('Token missing'));
    else if (!dniPaciente) cb(new Error('DNI Paciente missing'));
    else if (!idServicio) cb(new Error('idServicio Paciente missing'));
    else{
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
            let idServ = new mongodb.ObjectId(idServicio);
            serviciosAsignados.findOne({paciente: dniPaciente, servicio: idServ}).then(
                (_servicioAsignado) => {
                    let servicios = db.collection(SERVICIOS_COLLECTION);
                    servicios.findOne({ _id: _servicioAsignado.servicio }).then(_servicio => {
                        _servicioAsignado.servicio = _servicio;
                        _cb(null, _servicioAsignado);
                    }).catch(err => {
                        cb(err);
                    });
                    
                }).catch(err => {
                    cb(err);
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function getServiciosAsignadosPaciente(token, dniPaciente, opts, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!dniPaciente) cb(new Error('DNI Paciente missing'));
    else if (!opts) cb(new Error('Query missing'));
    else {
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
            opts["paciente"] = dniPaciente;

            serviciosAsignados.find(opts).toArray().then(_res => {
                if (!_res) _cb(null, [])
                else {
                    let servicios = db.collection(SERVICIOS_COLLECTION);
                    let resultado = _res;
                    let promises = resultado.map(servicioAsignado => {
                        return servicios.findOne({ _id: servicioAsignado.servicio }).then(_servicio => {
                            servicioAsignado.servicio = _servicio;
                        });
                    });

                    Promise.all(promises).then(() => {
                        _cb(null, resultado);
                    });
                }
                
            }).catch(err => {
                _cb(err);
            });
        }).catch(err => {
            cb(err);
        });
    }
}

function addServicioAsignado(token, servicioAsignado, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!servicioAsignado.servicio) cb(new Error('Servicio missing'));
    else if (!servicioAsignado.sanitarioResponsable) cb(new Error('Sanitario responsable missing'));
    else if (!servicioAsignado.paciente) cb(new Error('Paciente missing'));
    else if (!servicioAsignado.intervalo) cb(new Error('Intervalo missing'));
    else if (!servicioAsignado.valorMax) cb(new Error('Valor maximo missing'));
    else if (!servicioAsignado.observaciones) cb(new Error('Observaciones missing'));
    else {
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), esSanitario: true }).then(
                (_sanitario) => {
                    if (_sanitario) {

                        users.findOne({ dni: servicioAsignado.paciente, esSanitario: false }).then(
                            (_paciente) => {
                                if (_paciente) {
                                    let idServicio = new mongodb.ObjectId(servicioAsignado.servicio);
                                    servicioAsignado.servicio = idServicio;
                                    let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
                                    serviciosAsignados.insertOne(servicioAsignado).then(result => {
                                        _cb(null, _paciente);
                                    }).catch(err => {
                                        _cb(err)
                                    });
                                } else {
                                    _cb(new Error('El paciente no existe'));
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                    } else {
                        _cb(new Error('El sanitario no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function deleteServicioAsignado(token, idServicioAsignado, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!idServicioAsignado) cb(new Error('ID Servicio asignado missing'));
    else {
        baja = new Date();

        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), esSanitario: true }).then(
                (_sanitario) => {
                    if (_sanitario) {
                        let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
                        let idServicioAsignadoObj = new mongodb.ObjectId(idServicioAsignado);
                        serviciosAsignados.updateOne({ _id: idServicioAsignadoObj }, {$set: { activo: false, fechaBaja: baja }}).then(_res => {
                            if (!_res) _cb(new Error('El servicio asignado no existe'));
                            else {
                                _cb(null, false);
                            }
                        }).catch(err => {
                            _cb(err)
                        });
                    } else {
                        _cb(new Error('El sanitario no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function addMedicion(token, dniPaciente, idServicioAsignado, medicion, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!dniPaciente) cb(new Error('DNI paciente missing'));
    else if (!idServicioAsignado) cb(new Error('ID Servicio asignado missing'));
    else if (!medicion.valor) cb(new Error('Valor de la medición missing'));
    else if (!medicion.fecha) cb(new Error('Fecha de la medición missing'));
    else {
        medicion["valor"] = Number(medicion["valor"]);
        medicion["alarma"] = false;
        medicion["fecha"] = new Date(medicion["fecha"]);
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), dni: dniPaciente, esSanitario: false }).then(
                (_paciente) => {
                    if (_paciente) {
                        let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
                        serviciosAsignados.findOne({ _id: new mongodb.ObjectId(idServicioAsignado), paciente: dniPaciente }).then(
                            (_servicioAsignado) => {
                                if (_servicioAsignado) {
                                    //Si el valor de la medición sobrepasa el valor maximo establecido se genera una alarma
                                    if (_servicioAsignado.valorMax < medicion.valor) {
                                        medicion["alarma"] = true;
                                        let alarmas = db.collection(ALARMAS_COLLECTION);
                                        let alarma = {
                                            servicioAsignado: new mongodb.ObjectId(idServicioAsignado),
                                            fechaGenerada: new Date(),
                                            fechaGestionada: null
                                        }
                                        alarmas.insertOne(alarma)
                                    }

                                    //Registramos la medición
                                    serviciosAsignados.updateOne({ _id: new mongodb.ObjectId(idServicioAsignado) }, { $push: { mediciones: medicion } }).then(_res => {
                                        if (!_res) _cb(null, [])
                                        else {
                                            _cb(null, medicion)
                                        }
                                    })
                                } else {
                                    _cb(new Error('El paciente no tiene ese servicio asginado'));
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                    } else {
                        _cb(new Error('El paciente no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function deleteMedicion(token, dniPaciente, idServicioAsignado, medicion, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!dniPaciente) cb(new Error('DNI paciente missing'));
    else if (!idServicioAsignado) cb(new Error('ID Servicio asignado missing'));
    else if (!medicion) cb(new Error('Date medición missing'));
    else {
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), paciente: dniPaciente, esSanitario: false }).then(
                (_paciente) => {
                    if (_paciente) {
                        let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
                        serviciosAsignados.findOne({ _id: new mongodb.ObjectId(idServicioAsignado), paciente: dniPaciente }).then(
                            (_servicioAsignado) => {
                                if (_servicioAsignado) {
                                    //Si se había registrado una alarma con la medición a eliminar, la eliminamos tambien
                                    if (medicion.alarma) {
                                        let alarmas = db.collection(ALARMAS_COLLECTION);
                                        alarmas.deleteOne({ servicioAsignado: _servicioAsignado._id, fechaGenerada: medicion.fecha })
                                    }
                                    serviciosAsignados.updateOne({ _id: idServicioAsignado }, { $pull: { mediciones: medicion } }).then(_res => {
                                        if (!_res) _cb(null, [])
                                        else {
                                            _cb(null, _res)
                                        }
                                    })
                                } else {
                                    _cb(new Error('El paciente no tiene ese servicio asginado'));
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                    } else {
                        _cb(new Error('El paciente no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function getAlarmas(token, dniSanitario, cb) {
    if (!token) cb(new Error('Token missing'));
    else {
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), dni: dniSanitario, esSanitario: true }).then(
                (_sanitario) => {
                    if (_sanitario) {
                        let serviciosAsignados = db.collection(SERVICIOS_ASIGNADOS_COLLECTION);
                        serviciosAsignados.find({ sanitarioResponsable: dniSanitario }).toArray().then(_servicios => {
                            if (_servicios) {
                                let idServicios = []
                                _servicios.forEach((servicio) => {
                                    idServicios.push(servicio._id)
                                })
                                if (idServicios != []) {
                                    let alarmas = db.collection(ALARMAS_COLLECTION);
                                    alarmas.find({ servicioAsignado: { $in: idServicios } }).toArray().then(_alarmasFetched => {
                                        if (_alarmasFetched) _cb(null, _alarmasFetched)
                                        else _cb(null, [])
                                    }).catch(err => {
                                        _cb(err)
                                    });
                                } else {
                                    _cb(null, [])
                                }
                            } else {
                                _cb(new Error('El sanitario no esta realizando seguimientos'));
                            }
                        }).catch(err => {
                            _cb(err)
                        });
                    } else {
                        _cb(new Error('El sanitario no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

function gestionarAlarma(token, alarma, cb) {
    if (!token) cb(new Error('Token missing'));
    else if (!servicioAsignado) cb(new Error('Servicio asignado missing'));
    else {
        MongoClient.connect(url).then(client => {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }

            let db = client.db(DB_NAME);
            let users = db.collection(USERS_COLLECTION);

            users.findOne({ _id: new mongodb.ObjectId(token), esSanitario: true }).then(
                (_sanitario) => {
                    if (_sanitario) {
                        let alarmas = db.collection(ALARMAS_COLLECTION);
                        alarmas.updateOne({ _id: alarma._id }, { fechaGestionada: new Date() }).then(
                            (_alarm) => {
                                if (_alarm) {
                                    _cb(null, _alarm)
                                } else {
                                    _cb(new Error('La alarma no existe'));
                                }
                            }).catch(err => {
                                _cb(err)
                            });
                    } else {
                        _cb(new Error('El sanitario no existe'));
                    }
                }).catch(err => {
                    _cb(err)
                });
        }).catch(err => {
            cb(err);
        });
    }
}

module.exports = {
    login,
    listaPacientesPorSanitario,
    getPacientesPorServicioAsignado,
    updatePassword,
    addPaciente,
    addServicio,
    getServiciosSanitario,
    getServicioAsignadoPaciente,
    getServiciosAsignadosPaciente,
    addServicioAsignado,
    deleteServicioAsignado,
    addMedicion,
    deleteMedicion,
    getAlarmas,
    gestionarAlarma
}