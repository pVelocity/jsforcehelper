# jsforcehelper

This is an npm module design to perform common [jsforce](https://jsforce.github.io/document/) uses with pVelocity's [pvserver](https://github.com/pVelocity/pvserver).

## Getting Started

Install the ``jsforcehelper`` module.

    npm install --save jsforcehelper

Use the require statement to load the module.

```js
var jsfh = require('jsforcehelper');
```

jsforcehelper requires the following packages to be passed as a libray object for each function call.

```js
require('pvjs');

var pvh = require('pvserverhelper');
var jsapi = {};
jsapi.pvserver = require('pvserver');
pvh.setupLogger(jsapi);
```
The ``jsforce.Connection`` is accessible in ``jsapi.sfdcConn``.

To connect to a known Salesforce server using a username and password.
```js
jsapi.sfdc = {
	username: 'username',
	password: 'password',
	url: 'url'
};
jsfh.connect(jsapi).then(function(success) {
    if (success) {
        console.log('Success');
    } else {
        console.log('Failure');
    }
});
```

## Methods
All methods implement [jsforce](https://jsforce.github.io/document/) methods to perform their action, returning a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

- [connect](docs/connect.md)
- [connectWithSession](docs/connectWithSession.md)
- [describe](docs/describe.md)
- [query](docs/query.md)
- [insert](docs/insert.md)
- [update](docs/update.md)
- [delete](docs/delete.md)
- [upsert](docs/upsert.md)
- [bulkInsert](docs/bulkInsert.md)
- [bulkUpdate](docs/bulkUpdate.md)
- [bulkDelete](docs/bulkDelete.md)
- [bulkUpsert](docs/bulkUpsert.md)

## License

Copyright (c) 2016, pVelocity Inc

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.