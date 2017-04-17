### ``bulkUpdate(jsapi, objectName, records)``
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