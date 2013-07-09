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

    /* caso seja ambiente de produção, esconder erros */
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

var model = require('./model/Model'),
    auth = require('./utils/auth');
/*  Chamando controllers */
require('./controller/Company.js')({
    app      : app,
    model    : model,
    auth     : auth,
    config   : config
});
require('./controller/Category.js')({
    app      : app,
    model    : model,
    auth     : auth,
    config   : config
});
require('./controller/Account.js')({
    app      : app,
    model    : model,
    auth     : auth,
    config   : config
});
require('./controller/Transaction.js')({
    app      : app,
    model    : model,
    auth     : auth,
    config   : config
});


/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";
    response.header('Access-Control-Allow-Origin', '*');
    response.send(true);
});

app.get('/version', function (request, response) {
    "use strict";

    response.contentType('json');
    response.header('Access-Control-Allow-Origin', '*');

    var fs = require('fs'), regexm;

    fs.readFile('changelog.md', 'utf8', function(error, data) {
        if (error) response.send({error : error});
        else {
            regexm = data.match(/\#{2}\s*([0-9]+\.[0-9]+\.?[0-9]?)\s*(\((.*)\))?/);
            response.send({ version : regexm[1], date : regexm[3] });
        }
    });
});

app.get('/status', function (request, response) {
    "use strict";
    var Model = require('./model/Transaction.js').Transaction;

    response.contentType('json');
    response.header('Access-Control-Allow-Origin', '*');

    Model.count(function (error, count) {
        if (error) response.send({error : error})
        else {
            response.send({count : count});
        }
    })
});

app.get('/export.csv', function (request, response) {
    "use strict";

    response.contentType('csv');

    auth(request.param('token', null), function (error, data) {
        if (error) {
            response.send({error : error});
        } else {
            model.Company.findOne({company : data.company._id}, function (error, company) {

                function getCategory(id) {
                    for (var i in company.categories) {
                        if (company.categories[i]._id && id && company.categories[i]._id.toString() === id.toString()) {
                            return company.categories[i].name;
                        }
                    }
                    return '';
                }

                function getAccount(id) {
                    for (var i in company.accounts) {
                        if (company.accounts[i]._id && id && company.accounts[i]._id.toString() === id.toString()) {
                            return company.accounts[i].name;
                        }
                    }
                    return '';
                }

                if (error) {
                    response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                } else if (company === null) {
                    response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                } else {
                    var header = 'nome, categoria, conta, valor, data',
                        query = {};
                    response.write(header + '\n')

                    console.log(request.param('dateStart'));
                    console.log(request.param('dateEnd'));

                    query.company = company._id;
                    query.account = {$in : request.param('accounts')};
                    query.category = {$in : request.param('categories').concat(null)};
                    query.date = {$gt : new Date(request.param('dateStart')), $lt : new Date(request.param('dateEnd'))};

                    model.Transaction.find(query, function (error, transactions) {
                        console.log(transactions)
                        for (var i = 0; i < transactions.length; i++) {
                            response.write((transactions[i].name + ', ' + getCategory(transactions[i].category) + ', ' + getAccount(transactions[i].account) + ', ' + (transactions[i].type == 'debt' ? '-' : '+') + transactions[i].value + ', ' +  transactions[i].date.getDate() + '/' + (transactions[i].date.getMonth() + 1) + '/' + transactions[i].date.getFullYear() + '\n').toString("utf8"));
                        }
                        response.end()
                    });
                }
            });
        }
    });
});

/*  Ativando o server */
app.listen(config.host.port);