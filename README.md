# jsforcehelper

This is an npm module design to perform common jsforce uses with pVelocity's [pvserver](https://github.com/pVelocity/pvserver).

##Getting Started

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

To connect to a known Salesforce server using an access token.
```js
jsapi.sfdc = {
	instance_url: 'instance_url',
	access_token: 'access_token'
};
jsfh.connectWithSession(jsapi).then(function(success) {
    if (success) {
        console.log('Success');
    } else {
        console.log('Failure');
    }
});
```

##Methods
All methods implement [jsforce](https://jsforce.github.io/document/) methods to perform their action, returning a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

###``connect(jsapi, [pollInterval], [pollTimeout])``
Connect to a known Salesforce server using a username and password.
- `jsapi` `<Object>`
- `pollInterval` `<Number>`
- `pollTimeout` `<Number>`

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

###``connectWithSession(jsapi, [pollInterval], [pollTimeout])``
Connect to a known Salesforce server using an access token.
- `jsapi` `<Object>`
- `pollInterval` `<Number>`
- `pollTimeout` `<Number>`

```js
jsapi.sfdc = {
	instance_url: 'instance_url',
	access_token: 'access_token'
};
jsfh.connectWithSession(jsapi).then(function(success) {
    if (success) {
        console.log('Success');
    } else {
        console.log('Failure');
    }
});
```

###``query(jsapi, soql)``
Query using ``soql`` with an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``. If query exceeds the record limit, this method will query more until all records are retrieved.
- `jsapi` `<Object>`
- `soql` `<String>`

```js
jsfh.query(jsapi, 'SELECT Id, Username FROM User WHERE IsActive = true').then(function(result) {
	if (result.done === true) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``describe(jsapi, objectName)``
Fetch the meta info for ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`

```js
jsfh.describe(jsapi, 'User').then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``insert(jsapi, objectName, records)``
Insert ``records`` into ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`

```js
jsfh.insert(jsapi, 'Account', [
{ Name : 'Account #1', ... },
{ Name : 'Account #2', ... },
{ Name : 'Account #3', ... },
...
]).then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``delete(jsapi, objectName, records)``
Delete ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`

```js
jsfh.delete(jsapi, 'Account', [
'0017000000hOMChAAO',
'0017000000iKOZTAA4'
]).then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``update(jsapi, objectName, records)``
Update ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`

```js
jsfh.update(jsapi, 'Account', [
{ Id : '0017000000hOMChAAO', Name : 'Updated Account #1' },
{ Id : '0017000000iKOZTAA4', Name : 'Updated Account #2' }
]).then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``upsert(jsapi, objectName, records, extIdField)``
Upsert ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`
- `extIdField` `<String>`

```js
jsfh.upsert(jsapi, 'Account', [
 { Name : 'Record #1', ExtId__c : 'ID-0000001' },
 { Name : 'Record #2', ExtId__c : 'ID-0000002' }
], 'ExtId__c').then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``bulkInsert(jsapi, objectName, records)``
Bulk insert ``records`` into ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`

```js
jsfh.bulkInsert(jsapi, 'Account', [
{ Name : 'Account #1', ... },
{ Name : 'Account #2', ... },
{ Name : 'Account #3', ... },
...
]).then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``bulkDelete(jsapi, objectName, records)``
Bulk delete ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`

```js
jsfh.bulkDelete(jsapi, 'Account', [
'0017000000hOMChAAO',
'0017000000iKOZTAA4'
]).then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``bulkUpdate(jsapi, objectName, records)``
Bulk update ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`

```js
jsfh.bulkUpdate(jsapi, 'Account', [
{ Id : '0017000000hOMChAAO', Name : 'Updated Account #1' },
{ Id : '0017000000iKOZTAA4', Name : 'Updated Account #2' }
]).then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

###``bulkUpsert(jsapi, objectName, records, extIdField)``
Bulk upsert ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`
- `extIdField` `<String>`

```js
jsfh.bulkUpsert(jsapi, 'Account', [
 { Name : 'Record #1', ExtId__c : 'ID-0000001' },
 { Name : 'Record #2', ExtId__c : 'ID-0000002' }
], 'ExtId__c').then(function(result) {
	if (result) {
        console.log('Success');
	} else {
        console.log('Failure');
	}
});
```

##License

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