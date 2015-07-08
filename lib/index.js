// Load modules

var Hoek = require('hoek');
var Radius = require('radius');
var Dgram = require('dgram');


// Declare internals

var internals = {};


// Defaults

internals.defaults = {
    address: '0.0.0.0',
    port: 1812,
    secret: 'radiusSuperSecret',
    userName: 'hulk',
    userPassword: 'smash12345'
};


internals.options = {};


internals.codes = {
    request: 'Access-Request',
    reject: 'Access-Reject',
    accept: 'Access-Accept'
};


// Radius Server

internals.MockRadius = function (options) {

    var self = this;

    // $lab:coverage:off$

    self.options = Hoek.applyToDefaults(internals.defaults, options || {});

    // $lab:coverage:on$


    // dgram events

    var socket = Dgram.createSocket('udp4');


    self.socket = socket;


    self.socket.on('error', function (err) {

        // $lab:coverage:off$

        console.log('Server error:\n' + err);
        socket.close();

        // $lab:coverage:on$
    });


    self.socket.on('listening', function () {

        var address = socket.address();

        console.log('Server is listening on ' + address.address + ':' + address.port);
    });


    self.socket.on('message', function (message, remote) {

        var code;

        // decode packet
        var packet = Radius.decode({
            packet: message,
            secret: self.options.secret
        });

        // credentials
        var username = packet.attributes['User-Name'];
        var password = packet.attributes['User-Password'];

        // check username + password
        if (username === self.options.userName && password === self.options.userPassword) {
            code = internals.codes.accept;
        }
        else {
            code = internals.codes.reject;
        }

        // reponse
        var response = Radius.encode_response({
            packet: packet,
            code: code,
            secret: self.options.secret
        });

        console.log('Sending ' + code + ' for user ' + username);

        // send response to client
        self.socket.send(response, 0, response.length, remote.port, remote.address, function (err) {

            // $lab:coverage:off$

            if (err) {
                console.log('Error sending reponse to ', remote);
            }

            // $lab:coverage:on$
        });
    });

    return self;
};


internals.MockRadius.prototype.bind = function () {

    var self = this;

    self.socket.bind(self.options.port, self.options.address);
};


internals.MockRadius.prototype.close = function () {

    var self = this;

    self.socket.close();
};


module.exports = internals.MockRadius;

