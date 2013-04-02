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

/*  Chamando controllers */
require('./controller/Company.js')(app);
require('./controller/Category.js')(app);
require('./controller/Contact.js')(app);
require('./controller/Field.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request,response) {
    "use strict";

    response.contentType('json');
    response.header('Access-Control-Allow-Origin', '*');

    var fs = require('fs'), regexm;

    fs.readFile('changelog.md', 'utf8', function(error, data) {
        if (error) response.send({error : error});
        else {
            regexm = data.match(/\#{2} ([0-9]+\.[0-9]+\.?[0-9]?)( \((.*)\))?/);
            response.send({ version : regexm[1], date : regexm[2] });
        }
    });
});

/*  Ativando o server */
app.listen(config.host.port);