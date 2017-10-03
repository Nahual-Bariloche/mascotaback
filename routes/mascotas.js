var express = require('express');
var AWS = require("aws-sdk");
var router = express.Router();

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "nahual-mobilehub-241192654-Locations";

/* Obtener listado de mascotas */
router.get('/', (req, res, next) => {

  var params = {
      TableName: table
  };
  docClient.scan(params, function (err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Scan succeeded.");
          res.json(data);
      }
  });

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
