// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1639113973042055', // your App ID
        'clientSecret'    : 'd37b20984e357cc71867784c5d29cd5d', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : '4rpDU6Z2gWFsX8rVMAuFLZDX7',
        'consumerSecret'     : 'UbvoVVuzUr6EOcgUNhsv9D3kod9oMvOFFwtFuA5vmyxfCKBTSh',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '89215756602-8e9a0t2go3ha3gmkopo0r64loehuvh3h.apps.googleusercontent.com',
        'clientSecret'     : 'CFPuPZa7l6YMFBBhXqgsRFlO',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    },

    'githubAuth' : {
        'clientID'         : '646b3c1643b20170b3bb',
        'clientSecret'     : '4117fc5d93c7e3e5065a01508f943758ba2f4365',
        'callbackURL'      : 'http://localhost:8080/auth/github/callback'
    }

};
