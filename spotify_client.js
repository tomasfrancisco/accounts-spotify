Spotify = {};

// Request Spotify credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Spotify.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'spotify'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  var display = mobile ? 'touch' : 'popup';

  var scope = "playlist-modify-public";
  if (options && options.requestPermissions)
    scope = options.requestPermissions.join(',');

  var loginStyle = OAuth._loginStyle('spotify', config, options);

  // GET https://accounts.spotify.com/authorize/?client_id=5fe01282e44241328a84e7c5cc169165&
  //     response_type=code&
  //     redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&
  //     scope=user-read-private%20user-read-email&
  //     state=34fFs29kd09
  var loginUrl =
        'https://accounts.spotify.com/authorize?client_id=' + config.appId +
        '&response_type=code' +
        '&redirect_uri=' + OAuth._redirectUri('spotify', config) + 
        '&scope=' + scope +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);
  console.log(OAuth._redirectUri('spotify', config));
  OAuth.launchLogin({
    loginService: "spotify",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};