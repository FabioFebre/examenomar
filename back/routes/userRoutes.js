const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const validate = require('../middleware/validateUser');

// Obtener todos los usuarios
router.get('/', controller.getAll);

// Obtener usuario por id
router.get('/:id', controller.getById);

// Crear usuario (con validación)
router.post('/', validate, controller.create);

// Actualizar usuario (con validación)
router.put('/:id', validate, controller.update);

// Eliminar usuario
router.delete('/:id', controller.remove);

module.exports = router;
