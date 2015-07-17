var getInterface = require('steam-web-api');
var SteamCrypto = require('steam-crypto');

var SteamEResultOK = 1;

require('util').inherits(SteamWebLogOn, require('events').EventEmitter);

function handleLogOnResponse(logOnResponse) {
  if (logOnResponse.eresult == SteamEResultOK) {
    this.webLoginKey = logOnResponse.webapi_authenticate_user_nonce;
    this.emit('webSessionID', this.webLoginKey);
  }
}

function SteamWebLogOn(steamClient, steamUser) {
  this._steamClient = steamClient;
  this._steamUser = steamUser;

  this._steamClient.on('logOnResponse', handleLogOnResponse.bind(this));
}

SteamWebLogOn.prototype.webLogOn = function (callback) {
  var sessionKey = SteamCrypto.generateSessionKey();

  getInterface('ISteamUserAuth').post('AuthenticateUser', 1, {
    steamid: this._steamClient.steamID,
    sessionkey: sessionKey.encrypted,
    encrypted_loginkey: SteamCrypto.symmetricEncrypt(new Buffer(this.webLoginKey), sessionKey.plain)
  }, function(statusCode, body) {
    if (statusCode != 200) {
      // request a new login key first
      this._steamUser.requestWebAPIAuthenticateUserNonce(function(nonce) {
        this.webLoginKey = nonce.webapi_authenticate_user_nonce;
        this.webLogOn(callback);
      }.bind(this));
      return;
    }

    var sessionID = Math.floor(Math.random() * 1000000000).toString();
    this.cookies = [
      'sessionid=' + sessionID,
      'steamLogin=' + body.authenticateuser.token,
      'steamLoginSecure=' + body.authenticateuser.tokensecure
    ];

    callback(this.cookies);
  }.bind(this));
};

module.exports = SteamWebLogOn;
