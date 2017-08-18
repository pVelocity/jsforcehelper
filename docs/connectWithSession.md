### ``connectWithSession(jsapi, [pollInterval], [pollTimeout])``
Connect to a Salesforce server using an access token.
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