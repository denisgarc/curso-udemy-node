var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');

// ====================================================
// Obtener todos los usuarios
// ====================================================
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });
});

// ====================================================
// Crear un nuevo usuario
// ====================================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardaro) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardaro
        });
    });
});

// ====================================================
// Actualizar usuario
// ====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, userFinded) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!userFinded) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe el usuario con ese ID' }
            });
        }

        userFinded.nombre = body.nombre;
        userFinded.email = body.email;
        userFinded.role = body.role;
        userFinded.password = bcrypt.hashSync(body.password, 10);

        userFinded.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            userSaved.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: userSaved
            });
        });
    });

});

// ====================================================
// Borrar usuario
// ====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, userRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!userRemoved) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: userRemoved
        });
    });
});


module.exports = app;