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
  res.send('foo');
});

router.put('/:id', (req, res) => {
  // mandar req.body a la base
  let id = req.id;
  res.jsonp({ id: id });
});

module.exports = router;
