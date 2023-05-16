import axios from 'axios';
const url = 'http://localhost:8081/hospitalServices';

function login(id, password, esSanitario, cb) {
    if (!id) cb(new Error('Email not specified'));
    if (!password) cb(new Error('Password not specified'));
    else{
        axios.post(url + '/sessions',
        { id: id, password: password, esSanitario: esSanitario})
        .then(res => {
            cb(null, res.data.token, res.data.user)
            console.log("Bien")
        })
        .catch(err => {
            console.log("Error")
            cb(err);
        });
    }
}

function addPaciente(token, user, cb) {
    if (!user.dni) cb(new Error('DNI not specified'));
    if (!user.nombre) cb(new Error('Nombre not specified'));
    if (!user.apellido1) cb(new Error('Apellido1 not specified'));
    if (!user.apellido2) cb(new Error('Apellido2 not specified'));
    if (!user.password) cb(new Error('Password not specified'));
    else{
        axios.post(url + '/pacientes',
        { 
            token: token,
            user: user
        }).then(res => {
            cb(null, res.data)
            console.log("Bien")
        }).catch(err => {
            console.log("Error")
            cb(err);
        });
    }
}

function getPacientes(token, dni, cb){
    axios.get(url + '/pacientes',
        {
            params: { token: token, dni: dni }
        }).then(res => {
            cb(null, res.data)
        }).catch(err => {
            cb(err);
        });
}

function addServicio(token, servicio, dniSanitario, cb){
    axios.post(url + '/servicios',
    {
        params: { token: token, servicio: servicio, dniSanitario: dniSanitario }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function getServiciosSanitario(token, dniSanitario, cb){
    axios.get(url + '/sanitarios/' + dniSanitario + '/servicios',
    {
        params: { token: token, dniSanitario: dniSanitario }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function getServiciosAsignadosPaciente(dniPaciente, opts, cb){
    axios.get(url + '/pacientes/' + dniPaciente + '/servicios/asignados',
    {
        params: { dniPaciente: dniPaciente, opts: opts }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function addServicioAsignado(token, servicioAsignado, cb){
    axios.post(url + '/servicios/asignados',
    {
        params: { token: token, servicioAsignado: servicioAsignado }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function deleteServicioAsignado(token, idServicioAsignado, cb){
    axios.put(url + '/servicios/asignados/' + idServicioAsignado,
    {
        params: { token: token, idServicioAsignado: idServicioAsignado }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function addMedicion(token, dniPaciente, idServicioAsignado, medicion, cb){
    axios.post(url + '/servicios/asignados/' + idServicioAsignado + '/mediciones',
    {
        params: { token: token, dniPaciente: dniPaciente, idServicioAsignado: idServicioAsignado, medicion: medicion }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function deleteMedicion(token, dniPaciente, idServicioAsignado, medicion, cb){
    axios.delete(url + '/servicios/asignados/' + idServicioAsignado + '/mediciones',
    {
        params: { token: token, dniPaciente: dniPaciente, idServicioAsignado: idServicioAsignado, medicion: medicion }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function getAlarmas(token, dniSanitario, cb){
    axios.get(url + '/alarmas',
    {
        params: { token: token, dniSanitario: dniSanitario }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

function gestionarAlarma(token, alarma, cb){
    axios.put(url + '/alarmas/' + alarma.fechaGenerada,
    {
        params: { token: token, alarma: alarma }
    }).then(res => {
        cb(null, res.data)
    }).catch(err => {
        cb(err);
    });
}

export default{
    login,
    addPaciente,
    getPacientes,
    addServicio,
    getServiciosSanitario,
    getServiciosAsignadosPaciente,
    addServicioAsignado,
    deleteServicioAsignado,
    addMedicion,
    deleteMedicion,
    getAlarmas,
    gestionarAlarma
}