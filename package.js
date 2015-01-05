Package.describe({
  summary: "Login service for spotify accounts",
  version: "1.0.3"
});

Package.onUse(function(api) {
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('spotify_login_button.css', 'client');

  api.addFiles("spotify.js");
  api.addFiles(
    ['spotify_configure.html', 'spotify_configure.js'],
    'client');

  api.addFiles('spotify_server.js', 'server');
  api.addFiles('spotify_client.js', 'client');

});
