### ``connect(jsapi, username, password, url, [pollInterval], [pollTimeout])``
Connect to a known Salesforce server using a username and password.
- `jsapi` `<Object>`
- `username` `<String>`
- `password` `<String>`
- `url` `<String>`
- `pollInterval` `<Number>`
- `pollTimeout` `<Number>`

```js
jsfh.connect(jsapi, username, password, url).then(function(success) {
    if (success) {
        console.log('Success');
    } else {
        console.log('Failure');
    }
});
```