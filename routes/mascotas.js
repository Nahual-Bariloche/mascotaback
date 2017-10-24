let express = require('express');
let AWS = require('aws-sdk');
let config = require('../config');
let router = express.Router();

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1_UrF1N8JqK',
    RoleArn: 'arn:aws:cognito-idp:us-east-1:533832295765:userpool/us-east-1_UrF1N8JqK'
}, {
    region: 'us-east-1'
});

AWS.config.update({
    region: 'us-east-1',
    //endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

let dynamoDb = new AWS.DynamoDB({
    region: 'us-east-1',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

let docClient = new AWS.DynamoDB.DocumentClient({ service: dynamoDb, convertEmptyValues: true });
let table = 'Mascotas';

// let bucketArn = 'arn:aws:s3:::elasticbeanstalk-us-east-1-533832295765';
let bucketName = 'elasticbeanstalk-us-east-1-533832295765';

let s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'us-east-1',
    params: {Bucket: bucketName},
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    Delimiter: '/',
});

let guid = () => {
    let pad8 = (s) => {
        let p = (Math.random().toString(16) + '000000000').substr(2, 8);
        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    };
    return (pad8() + pad8(true) + pad8(true) + new Date().toISOString().slice(0, 10)).replace(/-/g, '');
};

/* Obtener listado de mascotas */
router.get('/', (req, res) => {

    let params = {
        TableName: table
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
            res.json(err);
        } else {
            console.log('Scan succeeded.');
            res.json(data.Items);
        }
    });
});

/* Obtener listado de mascotas encontradas*/
router.get('/encontradas', (req, res) => {

    let params = {
        TableName: table,
        ProjectionExpression: 'id, fecha_extraviado, raza, color, email',
        FilterExpression: 'busqueda = :busq',
        ExpressionAttributeValues: {
            ':busq': false
        }
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
            res.json(err);
        } else {
            console.log('Scan succeeded.');
            res.json(data.Items);
        }
    });
});

/* Obtener listado de mascotas encontradas*/
router.get('/perdidas', (req, res) => {

    let params = {
        TableName: table,
        ProjectionExpression: 'id, fecha_extraviado, raza, color, email',
        FilterExpression: 'busqueda = :busq',
        ExpressionAttributeValues: {
            ':busq': true
        }
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
            res.json(err);
        } else {
            console.log('Scan succeeded.');
            res.json(data.Items);
        }
    });
});

/* Obtener una mascota*/
router.get('/:id', (req, res) => {

    let params = {
        TableName: table,
        Key:{
            id: req.params.id
        }
    };

    docClient.get(params, (err, data) => {
        if (err) {
            console.error('Unable to get the item. Error JSON:', JSON.stringify(err, null, 2));
            res.json(err);
        } else {
            console.log('Get item succeeded.');
            res.json(data.Item);
        }
    });
});

/* Obtener listado de imagenes*/
router.get('/imagenes', (req, res) => {

    console.log('hola');

    let params = {
        Bucket: 'elasticbeanstalk-us-east-1-533832295765',
        Delimiter: '',
        Prefix: 'imagenes/'
    };

    s3.listObjects(params, (err, data) => {
        if (err) {
            console.log('Error', err);
            res.json(err);
        } else {
            console.log('Success', data);
            res.json(data);
        }
    });

});

/* Agregar una mascota */
router.post('/', (req, res) => {

    let newItem = req.body;
    newItem.id = guid();

    let params = {
        TableName: table,
        Item: newItem
    };

    console.log('Adding a new item...');
    docClient.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.send(err);
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            res.send(newItem);
        }
    });

});

/* Actualizar una mascota */
router.put('/:id', (req, res) => {
    // mandar req.body a la base
    let id = req.params.id;
    let response = {id: id, message: `Registro ${id} actualizado`};
    res.json(response);
});

/* Borrar una mascota */
router.delete('/:id', (req, res) => {
    // mandar req.body a la base
    let id = req.params.id;
    let response = {id: id, message: `Registro ${id} borrado`};
    res.json(response);
});

router.post('/upload/:id', function(req, res) {

    let image;
    for (var key in req.body) {
        image = key;
    }

    let id = req.params.id;
    let params = {
        Key: 'imagenes/' + id,
        Body: image,
        ACL: 'public-read'
    };

    s3.upload(params, (err, data) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json(data);
        }
    });
});

router.post('/testupload/:id', function(req, res) {
    res.json({ body: req.body, params: req.params, files: req.files });
});

module.exports = router;