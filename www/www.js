/** App
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-09
 *
 * @description : www da Empreendemia 3
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    /* Serve a pasta public */
    app.use('/', express.static('public'));

    /* caso seja ambiente de produção, esconder erros */
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Chamando controllers */
require('./controller/Feedback.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";

    response.contentType('json');
    response.header('Access-Control-Allow-Origin', '*');

    var fs = require('fs'), regexm;

    fs.readFile('changelog.md', 'utf8', function(error, data) {
        if (error) response.send({error : error});
        else {
            regexm = data.match(/\#{2} ([0-9]+\.[0-9]+\.?[0-9]?)\s*(\((.*)\))?/);
            response.send({ version : regexm[1], date : regexm[3] });
        }
    });
});

/*  Métodos para dev e teste */
app.get('/config', function (request, response) {
    "use strict";

    response.contentType('json');
    response.header('Access-Control-Allow-Origin', '*');

    var result = {services : {}};
    for (var i in config.services) {
        result.services[i] = {
            host : config.services[i].url,
            port : config.services[i].port
        }
    }
    response.send(result);
});

/*  Ativando o server */
app.listen(config.host.port);
