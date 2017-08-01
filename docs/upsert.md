### ``upsert(jsapi, objectName, records, extIdField, throwError)``
Upsert ``records`` from ``objectName`` using an existing ``jsforce.Connection`` saved as ``jsapi.sfdcConn``.
- `jsapi` `<Object>`
- `objectName` `<String>`
- `records` `<Array>`
- `extIdField` `<String>`
- `throwError` `<Boolean>`: Optional, default is `false`

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