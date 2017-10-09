var express = require('express');
var AWS = require('aws-sdk');
var router = express.Router();
var localhost = false;

if(localhost) {
    //LOCALHOST
    AWS.config.update({
        region: 'us-east-1', endpoint: "http://localhost:8000",
        credentials: new AWS.Credentials('akid', 'secret', 'session')
    });
} else {
    //AWS
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:c520d5fc-4aa5-4ec1-bd6f-b29bca765720',
        RoleArn: 'arn:aws:iam::533832295765:role/Cognito_DynamoPoolUnauth'
    });
    AWS.config.update({
        region: 'us-east-1' //,
        //    endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    });
}


var docClient = new AWS.DynamoDB.DocumentClient();
var table = 'publicaciones';


var guid = function() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }

    return (_p8() + _p8(true) + _p8(true) + new Date().toISOString().slice(0, 10)).replace(/-/g, "");
}

/* Obtener listado de mascotas */
router.get('/', (req, res, next) => {

    var params = {
        TableName: table
    };
    // res.json([
    //     { nombre: 'pipo', raza: 'perro', extraviado: '11/11/2016' },
    //     { nombre: 'pupi', raza: 'chihuahua', extraviado: '11/09/2017' },
    //     { nombre: 'blanca', raza: 'labrador', extraviado: '01/10/2017' }
    // ]);

    docClient.scan(params, function(err, data) {
        if(err) {
            console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
            res.json(err);
        } else {
            console.log('Scan succeeded.');
            res.json(data.Items);
        }
    });

});


/* Agregar una mascota */
router.post('/', (req, res) => {

    var newItem = req.body;
    newItem.id = guid();
    // mandar req.body a la base
    var params = {
        TableName: table, Item: newItem
    };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if(err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.send(newItem);
        }
    });

});

router.put('/:id', (req, res) => {
    // mandar req.body a la base
    let id = req.params.id;
    let response = {id: id, message: `Registro ${id} actualizado`};
    res.json(response);
});

router.delete('/:id', (req, res) => {
    // mandar req.body a la base
    let id = req.params.id;
    let response = {id: id, message: `Registro ${id} borrado`};
    res.json(response);
});


module.exports = router;
