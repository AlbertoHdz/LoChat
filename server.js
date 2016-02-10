// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional.
process.title = 'node-chat';

// Puerto en donde se escuchara el servidor
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// ultimos 100 messages
var history = [ ];
// lista de clientes conectados (users)
var clients = [ ];

/**
 * funcion de ayuda para cadenas de entrada de escape
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Array con colores que se mostraran los usuarios
var colors = [ 'red', 'green', 'blue', 'darkred', 'purple', 'plum', 'orange' ];
// ... se elige en orden aleatorio
colors.sort(function(a,b) { return Math.random() > 0.5; } );

/**
 * Servidor HTTP 
 */
var server = http.createServer(function(request, response) {
    // No importa mucho. estamos realizando un servidor WebSocket, no un servidor HTTP
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Servidor escuchando en puerto " + webSocketsServerPort);
});

/**
 * Servidor WebSocket
 */
var wsServer = new webSocketServer({
    //Servidor WebSocket is tied to a HTTP server. WebSocket recibe tal como si fuera una respuesta HTTP
    // revisar esto mejor -> http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// Esta funcion se manda llamar cada cierto tiempo
// Intenta conectarse al Servidor WebSocket
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connexion originaria de ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    var userName = false;
    var userColor = false;

    console.log((new Date()) + ' Connexion aceptada.');

    // envia el historial de mensajes
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    // el usuario envia algun mensaje
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // Acepta solo texto
            if (userName === false) { // El primer mensaje enciado por el usuario con su nombre
                // recuerda el nombre de usuario
                userName = htmlEntities(message.utf8Data);
                // Elige un color y lo envia de regreso
                userColor = colors.shift();
                connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
                console.log((new Date()) + ' User es conocido como: ' + userName
                            + ' con ' + userColor + ' color.');

            } else { // escribimos en consola y el broadcast del mensaje
                console.log((new Date()) + ' Mensaje recibido de '
                            + userName + ': ' + message.utf8Data);
                
                // queremos tener el historial de los mensajes enviados
                var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message.utf8Data),
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);

                // mensaje broadcast a todos los clientes conectados
                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    // user disconectado
    connection.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " desconectado.");
            // Elimina el usuario de la lista de clientes conectados
            clients.splice(index, 1);
            // Pone el color del usuario en la lista para reusarlo en otro cliente
            colors.push(userColor);
        }
    });

});