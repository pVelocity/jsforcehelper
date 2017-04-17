### ``connect(jsapi, [pollInterval], [pollTimeout])``
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