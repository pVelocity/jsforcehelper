### ``query(jsapi, soql)``
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