/** Contacts
 *
 * @autor : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Server de contacts da empreendemia
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
    auth = require('./utils/auth'),
    kamisama = require('./utils/kamisama');
/*  Chamando controllers */
require('./controller/Company.js')({
    app      : app,
    model    : model,
    kamisama : kamisama,
    auth     : auth,
    config   : config
});
require('./controller/Category.js')({
    app      : app,
    model    : model,
    kamisama : kamisama,
    auth     : auth,
    config   : config
});
require('./controller/Contact.js')({
    app      : app,
    model    : model,
    kamisama : kamisama,
    auth     : auth,
    config   : config
});
require('./controller/Field.js')({
    app      : app,
    model    : model,
    kamisama : kamisama,
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
    var Model = require('./model/Contact.js').Contact;

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
                        if (company.categories[i]._id.toString() === id.toString()) {
                            return company.categories[i].name;
                        }
                    }
                }

                if (error) {
                    response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                } else if (company === null) {
                    response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                } else {
                    var header = 'nome, categoria, email, telefone',
                        query = {};
                    for (var i = 0; i < company.fields.length; i++) {
                        if (company.fields.hasOwnProperty(i)) {
                            header += ', ' + company.fields[i].name;
                        }
                    }
                    response.write(header + '\n')

                    query.company  = company._id;
                    query.category = {$in : request.param('categories')};
                    query.user     = {$in : request.param('users')};
                    model.Contact.find(query, function (error, contacts) {
                        for (var i = 0; i < contacts.length; i++) {
                            var contact = contacts[i].name + ', ' + getCategory(contacts[i].category) + ', ' + contacts[i].email + ', ' + contacts[i].phone
                            if (contacts[i].fieldValues) {
                                for (var j = 0; j < contacts[i].fieldValues.length; j++) {
                                    contact += ', ' + contacts[i].fieldValues[j].value;
                                }   
                            }
                            response.write(contact.toString("utf8") + '\n');

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