### ``describe(jsapi, objectName)``
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