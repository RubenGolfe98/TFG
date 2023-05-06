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

function addPaciente(user, cb) {
    if (!user.dni) cb(new Error('DNI not specified'));
    if (!user.nombre) cb(new Error('Nombre not specified'));
    if (!user.apellido1) cb(new Error('Apellido1 not specified'));
    if (!user.apellido2) cb(new Error('Apellido2 not specified'));
    if (!user.password) cb(new Error('Password not specified'));
    else{
        axios.post(url + '/pacientes',
        { user: user})
        .then(res => {
            cb(null, res.data.user)
            console.log("Bien")
        })
        .catch(err => {
            console.log("Error")
            cb(err);
        });
    }
}

function getPacientes(token, dni, cb){
    axios.get(url + '/pacientes',
        {
            params: { token: token, dni: dni }
        })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

export default{
    login,
    addPaciente,
    getPacientes
}