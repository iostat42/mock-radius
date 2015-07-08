# mock-radius 
[![Build Status](https://travis-ci.org/iostat42/mock-radius.svg)](https://travis-ci.org/iostat42/mock-radius) 
[![Codacy Badge](https://www.codacy.com/project/badge/51611b0fa2d14573b0bb40196e073d44)](https://www.codacy.com/app/iostat42/mock-radius)

Radius server for testing purposes.

Listens on all interfaces by default and port 1812.


## Install

```bash
$ npm install mock-radius
```


## Usage

```bash
var config = {
    address: '0.0.0.0',
    port: 1812,
    secret: 'radiusSuperSecret',
    userName: 'hulk',
    userPassword: 'smash12345'
};

var mockradius = new MockRadius(config);

mockradius.bind();
```

## Run Tests

```bash
$ npm test
```


## License

MIT
