### ``delete(jsapi, objectName, records, throwError)``
Delete ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`
- `throwError` `<Boolean>`: Optional, default is `false`

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