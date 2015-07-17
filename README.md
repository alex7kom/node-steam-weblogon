# Steam WebLogOn

WebLogOn implementaion for [node-steam](https://github.com/seishun/node-steam) 1.x.

# Installation

```
npm install steam-weblogon
```

# Usage

Instantiate a `SteamWebLogOn` object.

```js
var SteamWebLogOn = require('steam-weblogon');
var steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
```

Here `steamClient` is a `SteamClient` instance and `steamUser` is a `SteamUser` instance.

The API basically dublicates `webLogOn` from the old node-steam, so you use it like this:

```js
steamWebLogOn.on('webSessionID', function(sessionID) {
  console.log(sessionID);
  steamWebLogOn.webLogOn(function(cookies){
    console.log(cookies);
  });
});
```

# API

## Methods

### webLogOn(callback)

Logs into Steam Community. You only need this if you know you do. `callback` will be called with an array of your new cookies (as strings).

Do not call this before the first ['webSessionID' event](#websessionid), or you'll get a broken cookie. Feel free to call this whenever you need to refresh your web session - for example, if you log into the same account from a browser on another computer.

## Events

### 'webSessionID'
* your new sessionID

If you are using Steam Community (including trading), you should call [webLogOn](#weblogoncallback) again, since your current cookie is no longer valid.

# License

The original implementation by __seishun__ is from [node-steam#182](https://github.com/seishun/node-steam/issues/182#issuecomment-122006314).

MIT
