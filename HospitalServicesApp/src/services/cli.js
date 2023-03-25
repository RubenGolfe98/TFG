import axios from 'axios';
const url = 'http://localhost:8081/hospitalServices';

function login(id, password, doctor, cb) {
    if (!id) cb(new Error('Email not specified'));
    if (!password) cb(new Error('Password not specified'));
    else{
        axios.post(url + '/sessions',
        { id: id, password: password, doctor: doctor})
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

export default{
    login
}