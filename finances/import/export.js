var Model = require('./../model/Model.js');

Model.User.findById('508e64bc0292c7536a000003', function (error, user) {
    var handledTransactions = false,
        handledTransfers = false,
        res = [],
        categories,
        accounts,
        monthStart = new Date(2012, 11, 1, 1),
        monthFinish = new Date(2012, 11, 31, 1);
 
    function format(date) {
        if (date) {
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        }
    }

    function print() {
        if (handledTransactions && handledTransfers) {
            console.log('"Data", "Descrição", "Valor", "Categoria", "Conta"');
            for (var i in res) console.log('"' + format(res[i].date) + '", "' + res[i].name + '", "' + (res[i].type === 'credit' ? '+' : '-') + res[i].value + '", "' + res[i].category + '", "' + res[i].account + '"');
        }
    }
    
    function getCategory(id) {
        for (var i in categories) {
            if (id && categories[i] && categories[i] && categories[i]._id && categories[i]._id.toString() === id.toString()) {
                return categories[i].name;
            }
        }
        return '';
    }

    function getAccount(id) {
        for (var i in accounts) {
            if (id && accounts[i] && accounts[i]._id && accounts[i]._id.toString() === id.toString()) {
                return accounts[i].name;
            }
        }
        return '';
    }
 
    categories = user.categories;
    accounts = user.accounts;

    Model.Transaction.find({userId : user._id}, function (error, transactions) {
        for (var i in transactions) {
            if (transactions[i].date > monthStart && transactions[i].date < monthFinish) {
                res.push({
                    category    : getCategory(transactions[i].categoryId),
                    account   : getAccount(transactions[i].accountId),
                    name        : transactions[i].name,
                    value       : transactions[i].value,
                    date        : transactions[i].date,
                    noteNumber  : transactions[i].noteNumber,
                    situation   : transactions[i].situation,
                    type        : transactions[i].type
                });
            }
        }
        print(handledTransactions = true);
    });
    
    Model.Transfer.find({userId : user._id}, function (error, transfers) {
        for (var i in transfers) {
            if (transfers[i].date > monthStart && transfers[i].date < monthFinish) {
                res.push({
                    category    : '',
                    account   : getAccount(transfers[i].creditId),
                    name        : 'Transferencia de ' + getAccount(transfers[i].debtId) + ' para ' + getAccount(transfers[i].creditId),
                    value       : transfers[i].value,
                    date        : transfers[i].date,
                    noteNumber  : '',
                    situation   : transfers[i].situation,
                    type        : 'credit'
                });
                res.push({
                    category    : '',
                    account   : getAccount(transfers[i].debtId),
                    name        : 'Transferencia de ' + getAccount(transfers[i].debtId) + ' para ' + getAccount(transfers[i].creditId),
                    value       : transfers[i].value,
                    date        : transfers[i].date,
                    noteNumber  : '',
                    situation   : transfers[i].situation,
                    type        : 'debt'
                });
            }
        }
        print(handledTransfers = true);
    })
});
