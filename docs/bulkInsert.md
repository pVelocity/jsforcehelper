### ``bulkInsert(jsapi, objectName, records, throwError)``
Bulk insert ``records`` into ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`
- `throwError` `<Boolean>`: Optional, default is `false`

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