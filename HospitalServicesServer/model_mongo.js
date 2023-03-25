const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const DB_NAME = 'hospitalAlcoy'

//let cb = (err, res)=>console.log(err? `ERROR: ${err.stack}` : `SUCCESS: ${JSON.stringify(res)}`)
//login("1234","1234", cb)

function login(id, password, doctor, cb) {
    console.log('login(' + id + ', ' + password + ', ' + cb + ')');

    MongoClient.connect(url).then(client => {
        // create new callback for closing connection
        _cb = function (err, res, res2) {
            client.close();
            cb(err, res, res2);
        }
        let db = client.db(DB_NAME);
        let col = db.collection('usuarios');
        col.findOne({ id: id, password: password, doctor: doctor.toString()}).then(_user => {
            if (!_user) _cb(new Error('Wrong authentication'));
            else {
                _cb(null, _user._id.toHexString(), {
                    id: _user._id.toHexString(), nombre: _user.nombre, apellido1: _user.apellido1,
                    id: _user.id, apellido2: _user.apellido2, doctor: _user.doctor
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
    login
}