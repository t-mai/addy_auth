var util = require('util');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var os = require('os')
var port = process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var nodeEnv = process.env.NODE_ENV || 'unknown';
var server = http.createServer(function(request, response) {
    response.writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
    });
    process.on('uncaughtException', function(err) {
        response.end("Exception");
    });

    try {
        if (request.method == "POST") {
            var url = request.url;
            if (url == "/auth") {

                var body = '';
                request.on('data', function(chunk) {
                    body += chunk.toString();
                });

                request.on('end', function() {
                    var params = JSON.parse(body);
                    console.log("Recived Params: " + JSON.stringify(params));
                    var uuId = params.uuid;
                    var accessToken = params.access_token;

                    var msg = {
                        'op': 'authdone',
                        'accessToken': accessToken
                    };
                    if (clients[uuId] != undefined || clients[uuId] != null) {
                        clients[uuId].send(JSON.stringify(msg), {
                            mask: false
                        });
                        delete clients[uuId];
                        response.end('{"status":"OK"}');

                    } else {
                        response.end('{"status":"NOK"}');
                    }
                });
            } else {
                response.end('{"status":"NOK"}');

            }
        } else {
            response.end("NOT Supported");
        }

    } catch (e) {
        response.end("Exception");

    }
});
server.listen(port);
console.log('Server running on ' + ip + ':' + port);
