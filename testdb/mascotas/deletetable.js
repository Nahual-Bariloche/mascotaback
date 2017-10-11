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

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "publicaciones"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

