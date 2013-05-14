var model = require('./model/Model.js'),
    config = require('./config.js'),
    now = new Date();

function removeToken(user, token) {
    token.remove(function () {
        user.save();
    });
}

function removeTokens(user) {
    for (var j in user.tokens) {
        if (new Date(user.tokens[j].dateExpiration) < now) {
            removeToken(user, user.tokens[j]);
        }
    }
}

model.User.find({'tokens.dateExpiration' : {$lt : now}}, function (error, users) {
    for (var i in users) {
        removeTokens(users[i])
    }
});