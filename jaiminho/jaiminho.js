/** Mail
 *
 * @autor : Mauro Ribeiro
 * @since : 2013-03
 *
 * @description : Server de mails
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
require('./controller/Mail.js')({
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
    response.header('Access-Control-Allow-Origin', '*');
    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);