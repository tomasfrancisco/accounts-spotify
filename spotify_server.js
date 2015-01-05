Spotify = {};

var querystring = Npm.require('querystring');


OAuth.registerService('spotify', 2, null, function(query) {
  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);
  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    id: identity.id
  };

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.display_name}}
  };
});

// checks whether a string parses as JSON
var isJSON = function (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'spotify'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access token
    responseContent = HTTP.post(
      "https://accounts.spotify.com/api/token", {
        params: {
          code: query.code,
          client_id: config.appId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('spotify', config),
          grant_type: 'authorization_code'
        }
      }).content;

  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Spotify. " + err.message),
                   {response: err.response});
  }

  if (isJSON(responseContent) && responseContent.error) { //error in content
    throw new Error("Failed to complete OAuth handshake with Spotify. " + responseContent);
  }

  // Success!  Extract!
  responseContent = JSON.parse(responseContent);
  var spAccessToken = responseContent.access_token;
  var spExpires = responseContent.expires_in;

  if (!spAccessToken) {
    throw new Error("Failed to complete OAuth handshake with spotify " +
                    "-- can't find access token in HTTP response. " + responseContent);
  }
  return {
    accessToken: spAccessToken,
    expiresIn: spExpires
  };
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get("https://api.spotify.com/v1/me", {
      params: {access_token: accessToken}}).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Spotify. " + err.message),
                   {response: err.response});
  }
};

Spotify.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
