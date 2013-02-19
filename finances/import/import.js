var Model = require('./../model/Model.js');

function trim(str) {
    if (str) {
        return str.replace(/^\s+|\s+$/g,"");
    } else {
        return '';
    }
}

var fs = require('fs'),
    user;

Model.User.findOne({user : '50804c38892f21760e00002b'}, function (error, user) {
    console.log(user)
    var categories = user.categories,
        accounts = user.accounts;

    fs.readFile('./import.txt', function (error, data) {
        var temp = data.toString().split('\n');
        for (var i in temp) {
            var registry = temp[i].split(','),
                dateSplit = registry[0].split('/');

            if (dateSplit.length === 3) {
                var data = new Date(dateSplit[2], dateSplit[1], dateSplit[0]),
                    categoryName = registry[1],
                    description = trim(registry[2]) ? trim(registry[2]) : 'sem nome',
                    category,
                    type = 'transfer';

                if (trim(registry[3]) !== '') {
                    type = 'credit';
                }
                if (trim(registry[4]) !== '') {
                    type = 'debt';
                }
                for (var j in categories) {
                    if (categories[j].name === categoryName) {
                        category = categories[j]._id;
                    }
                }

                if (type === 'transfer') {
                    var fromName  = trim(registry[7]),
                        toName    = trim(registry[8]),
                        value = trim(registry[6]),
                        from,
                        to,
                        transfer;

                    for (var j in accounts) {
                        if (accounts[j].name === fromName) {
                            from = accounts[j]._id;
                        }
                    }
                    for (var j in accounts) {
                        if (accounts[j].name === toName) {
                            to = accounts[j]._id;
                        }
                    }

                    transfer = new Model.Transaction({
                        user      : user,
                        debtId      : from,
                        creditId    : to,
                        value       : value,
                        date        : data,
                        recurrence  : 0,
                        situation   : 'paid'

                    });
                    //transfer.save();
                    console.log(transfer)
                } else if (type === 'credit') {
                    var accountName = trim(registry[5]),
                        value = trim(registry[3]),
                        account,
                        credit;

                    for (var j in accounts) {
                        if (accounts[j].name === accountName) {
                            account = accounts[j]._id;
                        }
                    }

                    credit = new Model.Transaction({
                        user      : user,
                        category  : category,
                        account   : account,
                        name        : description,
                        value       : value,
                        date        : data,
                        recurrence  : 0,
                        situation   : 'paid',
                        type        : 'credit'

                    });
                    //credit.save();
                    console.log(credit)
                } else {
                    var accountName = trim(registry[5]),
                        value = trim(registry[4]),
                        account,
                        debt;

                    for (var j in accounts) {
                        if (accounts[j].name === accountName) {
                            account = accounts[j]._id;
                        }
                    }

                    debt = new Model.Transaction({
                        user      : user,
                        category  : category,
                        account   : account,
                        name        : description,
                        value       : value,
                        date        : data,
                        recurrence  : 0,
                        situation   : 'paid',
                        type        : 'credit'

                    });
                    //debt.save();
                    console.log(debt)
                }
            }
        }
    });
});