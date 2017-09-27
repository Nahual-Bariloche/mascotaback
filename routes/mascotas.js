var express = require('express');
var router = express.Router();

/* Obtener listado de mascotas */
router.get('/', (req, res, next) => {
  let pipo = { nombre: "pipo", raza: "perro", extraviado: "25/09/2017" };
  let pupi = { nombre: "pupi", raza: "caniche toy", extraviado: "24/09/2017" };
  res.json([pipo, pupi]);
});

/* Agregar una mascota */
router.post('/', (req, res) => {
  // mandar req.body a la base
  res.send(req.body);
});

router.put('/:id', (req, res) => {
  // mandar req.body a la base
  let id = req.params.id;
  let response = { id: id, message: `Registro ${id} actualizado` };
  res.json(response);
});

router.delete('/:id', (req, res) => {
  // mandar req.body a la base
  let id = req.params.id;
  let response = { id: id, message: `Registro ${id} borrado` };
  res.json(response);
});

module.exports = router;
