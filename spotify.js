Accounts.oauth.registerService('spotify');

if (Meteor.isClient) {
  Meteor.loginWithSpotify = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Spotify.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    // publish all fields including access token, which can legitimately
    // be used from the client (if transmitted over ssl or on
    // localhost).
    forLoggedInUser: ['services.spotify'],
    forOtherUsers: [
    ]
  });
}
