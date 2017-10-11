var AWS = require("aws-sdk");

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

var table = "publicaciones";

var guid = function () {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return (_p8() + _p8(true) + _p8(true)+new Date().toISOString().slice(0,10)).replace(/-/g,"");
}

var newItem = {
    "id": guid(),
    "persona": {
        "nombre": "Juan",
        "appellido": "Perez",
        "telefono": "444-1234",
        "direccion": "mi casa"
    },
    "mascota": {
        "raza": "chihuahua",
        "color": "negro",
        "caracteristicas": "lo volvi a perder",
        "collar": true,
        "nombre": "Jasinto",
        "genero": "machito",
        "foto" : "link-foto-3",
        "edad": 4
    },
    "fecha": "08/07/2017",
    "busqueda": true
};


var params = {
    TableName:table,
    Item: newItem
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});
