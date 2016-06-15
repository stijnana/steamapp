var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , SteamStrategy = require('passport-steam').Strategy
  , steam = require('steam-web');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:20000/auth/steam/return',
    realm: 'http://localhost:20000/',
    apiKey: '8E9048FACE6C8ACD3714439FB9602D25'
  },
  function(identifier, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                // To keep the example simple, the user's Steam profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Steam account with a user record in your database,
                // and return that user instead.
                profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
    secret: '-- S3CR3TS3SSI0N --',
    name: 'S3SS10N1D',
    resave: true,
    saveUninitialized: true}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../../public'));

app.get('/', function(req, res){
    res.render('index', { user: req.user });

    var steamId = (req.user._json.steamid);
    s.getOwnedGames({
        steamid: steamId,
        callback: function(err,data) {
            var totalGames = (data.response.game_count);
            var result = Math.floor((Math.random() * totalGames  ));
            var randomNumer = (data.response.games[result]);
            var randomGame = randomNumer.appid;
            console.log(randomGame);
        }
    })
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');

}

var server = app.listen(20000, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});



var s = new steam({
    apiKey: '8E9048FACE6C8ACD3714439FB9602D25',
    format: 'json' //optional ['json', 'xml', 'vdf'],

});


//s.getOwnedGames({
//    steamid: '76561198058444302',
//    callback: function(err,data) {
//        var totalGames = (data.response.game_count);
//        var result = Math.floor((Math.random() * totalGames  ));
//        var randomGame = (data.response.games[result]);
//        console.log(randomGame.appid);
//    }
//})

//76561198058444302
//s.getFriendList({
//    steamid: '76561198058444302',
//    relationship: 'all', //'all' or 'friend'
//    callback: function (err, data) {
//        console.log(data);
//        console.log(JSON.stringify(data))
//    },
//})


