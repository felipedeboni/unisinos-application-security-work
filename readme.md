# Application Security - College Work

### Pre-requisites
   * [node.js]: <http://nodejs.org>

### Install
```
npm install
npm install -g nodemon
npm install -g node-inspector
```

nodemon is used on ```npm start```
node-inspector is used to debug

### Setup DB
```
node db-create.js
node db-seed.js
```

Default user is ```admin@gmail.com``` and password is ```root```

### Development
```
npm start
```
or
```
node ./bin/www
```
or
```
DEBUG=app node --debug ./bin/www
```

### Debugging
Start the application, on a new terminal tab/window, type:
```
node-inspector
```

### Notes

Several things in this project is intentionally made the wrong way,
so vulnerabilities can be exploited like SQL Injection, XSS and etc.


License
-------

Copyright (c) 2013 Stephen Mathieson Licensed under the WTFPL license.
