var AWS = require("aws-sdk");
var fs = require('fs');
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

console.log("Importing publicaciones into DynamoDB. Please wait.");

var publicaciones = JSON.parse(fs.readFileSync('testdb/mascotas/publicaciones.json', 'utf8'));
publicaciones.forEach(function(publicacion) {
    var params = {
        TableName: "publicaciones",
        Item: {
            "id":  publicacion.id,
            "persona": publicacion.persona,
            "mascota":  publicacion.mascota,
            "fecha": publicacion.fecha,
            "busqueda": publicacion.busqueda
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add movie", publicacion.id, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", publicacion.id);
        }
    });
});