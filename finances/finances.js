/** Finances
 *
 * @autor : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Server de finances da empreendemia
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('view engine', 'ejs');

    //caso seja ambiente de produção, esconder erros
    if(config.host.debuglevel === 0){
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Chamando controllers */
require('./controller/User.js')(app);
require('./controller/Category.js')(app);
require('./controller/Account.js')(app);
require('./controller/Transaction.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request,response) {
    "use strict";

    response.contentType('json');
    response.header('Access-Control-Allow-Origin', '*');

    var fs = require('fs'), regexm;

    fs.readFile('changelog.md', 'utf8', function(error, data) {
        if (error) response.send({error : error});
        else {
            regexm = data.match(/\#{2} ([0-9]+\.[0-9]+\.?[0-9]?) \((.*)\)/);
            response.send({ version : regexm[1], date : regexm[2] });
        }
    });
});

/*  Migração do master para a2 */
app.get('/migrate', function (request,response) {
    Model = require('./model/Model.js')

    Model.User.find(function (error, users) {
        Model.Transaction.find(function (error, transactions) {
            Model.Transfer.find(function (error, transfers) {

                for (var i in transactions) {
                    transactions[i] = {
                        _id : transactions[i]._id,
                        user : transactions[i].userId,
                        category : transactions[i].categoryId,
                        account : transactions[i].accountId,
                        name : transactions[i].name,
                        value : transactions[i].value,
                        date : transactions[i].date,
                        recurrence : transactions[i].recurrence,
                        noteNumber : transactions[i].noteNumber,
                        situation : transactions[i].situation,
                        type : transactions[i].type,
                        isTransfer : false
                    }
                }

                for (var i in transfers) {
                    transactions.push({
                        _id : transfers[i]._id,
                        user : transfers[i].userId,
                        category : null,
                        account : transfers[i].debtId,
                        name : null,
                        value : transfers[i].value,
                        date : transfers[i].date,
                        recurrence : transfers[i].recurrence,
                        noteNumber : null,
                        situation : transfers[i].situation,
                        type : 'debt',
                        isTransfer : true
                    });
                    transactions.push({
                        _id : transfers[i]._id,
                        user : transfers[i].userId,
                        category : null,
                        account : transfers[i].creditId,
                        name : null,
                        value : transfers[i].value,
                        date : transfers[i].date,
                        recurrence : transfers[i].recurrence,
                        noteNumber : null,
                        situation : transfers[i].situation,
                        type : 'credit',
                        isTransfer : true
                    });
                }

                response.send({
                    User : users,
                    Transaction : transactions
                });
            });
        });
    });

});

/*  Ativando o server */
app.listen(config.host.port);