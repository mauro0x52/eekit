var model = require('./model/Model.js'),
    config = require('./config.js'),
    now = new Date(), totalUsers = 0, usersArray = [];

saveAll = function () {
    var user = usersArray.pop();
    user.save(function (error, saved) {
        if (--totalUsers) saveAll();
    });
}

model.User.find({'tokens.dateExpiration' : {$lt : now}}, function (error, users) {
    var handled = 0;
    for (var i in users) {
        for (var j in users[i].tokens) {
            if (new Date(users[i].tokens[j].dateExpiration) < now) {
                users[i].tokens[j].remove();
            }
        }
        usersArray.push(users[i]);
        totalUsers++;
    }
    saveAll();
});
