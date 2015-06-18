// Load modules

var Lab = require('lab');
var Code = require('code');
var Hoek = require('hoek');
var MockRadius = require('../index');
var Radclient = require('radclient');

// var Config = require('./artifacts/config');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var expect = Code.expect;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;

// Declare internals

var internals = {};


internals.mockradius = new MockRadius({});


// Defaults

internals.defaults = {};


internals.codes = {
    request: 'Access-Request',
    reject: 'Access-Reject',
    accept: 'Access-Accept'
};


internals.getPacket = function (options) {

    var packet = {
        code: 'Access-Request',
        secret: options.secret,
        identifier: 123,
        attributes: [
            ['User-Name', options.userName],
            ['User-Password', options.userPassword]
        ]
    };

    return packet;
};


internals.getOptions = function (options) {

    if (typeof options === 'undefined') {
        options = {};
    }

    var serverOpts = {
        host: options.host || '127.0.0.1',
        port: options.port || 1812
    };

    return serverOpts;
};


internals.sendPacket = function (packet, options, callback) {

    Radclient(packet, options, function (err, response) {

        if (err) {
            callback(err);
        }
        else {
            callback(null, response);
        }
    });
};


// Tests

describe('mock-radius', function () {

    before(function (done) {

        internals.mockradius.bind();
        done();
    });


    after(function (done) {

        internals.mockradius.close();
        done();
    });


    it('listens on correct port and address', function (done) {

        var mock = internals.mockradius;
        var address = mock.socket.address();
        expect(mock).to.be.an.instanceof(MockRadius);
        expect(address.port).to.equal(mock.options.port);
        expect(address.address).to.equal(mock.options.address);
        done();
    });


    it('authenticates a user', function (done) {

        var mock = internals.mockradius;
        var address = mock.socket.address();

        var packet = internals.getPacket(mock.options);

        var options = internals.getOptions({ host: '127.0.0.1', port: address.port });

        internals.sendPacket(packet, options, function (err, response) {

            expect(err).to.not.exist();
            expect(response).to.exist();
            expect(response.code).to.equal(internals.codes.accept);
            done();
        });
    });


    it('does not authenticate a user with bad credentials', function (done) {

        var mock = internals.mockradius;
        var address = mock.socket.address();

        var packet = internals.getPacket(mock.options);

        packet.attributes = [
            ['User-Name', 'redhulk'],
            ['User-Password', 'GreenIsNotForMe']
        ];

        var options = internals.getOptions({ host: '127.0.0.1', port: address.port });

        internals.sendPacket(packet, options, function (err, response) {

            expect(err).to.not.exist();
            expect(response).to.exist();
            expect(response.code).to.equal(internals.codes.reject);
            done();
        });
    });


    // it('handles an unknown packet type', function (done) {

    //     var mock = internals.mockradius;
    //     var address = mock.socket.address();

    //     var packet = internals.getPacket(mock.options);

    //     packet.code = 'Access-Unknown-Packet';

    //     var options = internals.getOptions({ host: '127.0.0.1', port: address.port });

    //     internals.sendPacket(packet, options, function (err, response) {

    //         expect(err).to.exist();
    //         expect(err.message).to.equal('encode: invalid packet code \'Access-Unknown-Packet\'');
    //         done();
    //     });
    // });


    // it('handles an invalid response', function (done) {

    //     var mock = internals.mockradius;
    //     var address = mock.socket.address();

    //     var packet = internals.getPacket(mock.options);

    //     // bad shared secret
    //     packet.secret = 'I1sAbAD53cr3t';

    //     var options = internals.getOptions({ host: '127.0.0.1', port: address.port });

    //     internals.sendPacket(packet, options, function (err, response) {

    //         expect(err).to.exist();
    //         expect(err.message).to.equal('RADIUS response is invalid');
    //         done();
    //     });
    // });
});
