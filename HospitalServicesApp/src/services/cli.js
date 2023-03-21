import axios, * as others from 'axios';
const url = 'http://localhost:8081/hospitalServices';

function login(id, password, cb) {
    if (!id) cb(new Error('Email not specified'));
    if (!password) cb(new Error('Password not specified'));
    else{
        axios.post(url + '/sessions',
        { id: id, password: password })
        .then(res => {
            cb(null, res.data.token, res.data.user)
        })
        .catch(err => {
            cb(err);
        });
    }
}

export default{
    login
}