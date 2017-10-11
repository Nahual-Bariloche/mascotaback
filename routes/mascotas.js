let express = require('express');
let AWS = require('aws-sdk');
let config = require('../config');
let router = express.Router();

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:c520d5fc-4aa5-4ec1-bd6f-b29bca765720',
    RoleArn: 'arn:aws:iam::533832295765:role/Cognito_DynamoPoolUnauth'
}, {
    region: 'us-east-1'
});

AWS.config.update({
    region: 'us-east-1',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

let docClient = new AWS.DynamoDB.DocumentClient();

let table = 'Mascota';

//let bucketArn = 'arn:aws:s3:::elasticbeanstalk-us-east-1-533832295765';
// let bucketName = 'elasticbeanstalk-us-east-1-533832295765';

// let s3 = new AWS.S3({
//     apiVersion: '2006-03-01',
//     params: {Bucket: bucketName}
// });


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


/* Agregar una mascota */
router.post('/', (req, res) => {
    let params = {
        TableName:table,
        Item: req.body
    };

    docClient.put(params, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

/* Actualizar una mascota */
router.put('/:id', (req, res) => {
    // mandar req.body a la base
    let id = req.params.id;
    let response = { id: id, message: `Registro ${id} actualizado` };
    res.json(response);
});

/* Borrar una mascota */
router.delete('/:id', (req, res) => {
    // mandar req.body a la base
    let id = req.params.id;
    let response = { id: id, message: `Registro ${id} borrado` };
    res.json(response);
});

router.post('/upload/:id', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let id = req.params.id;

    // s3.upload({
    //     Key: id,
    //     Body: file,
    //     ACL: 'public-read'
    // }, function(err, data) {
    //     if (err) {
    //         res.json(err);
    //     }
    //     else {
    //         res.json(data);
    //     }
    // });

    res.json({ result: id});
});

module.exports = router;
