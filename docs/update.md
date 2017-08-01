### ``update(jsapi, objectName, records, throwError)``
Update ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`
- `throwError` `<Boolean>`: Optional, default is `false`

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