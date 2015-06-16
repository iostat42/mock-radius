# radius-js

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
