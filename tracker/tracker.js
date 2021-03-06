/** Trackers
 *
 * @autor : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Server de tracking da empreendemia
 */

var express = require('express'),
    config  = require('./config.js'),
    cluster = require('cluster');

if (cluster.isMaster) {
    cluster.on('disconnect', cluster.fork);

    for (i = 0; i < require('os').cpus().length; i = i + 1) {
        cluster.fork();
    }
} else {
    var app = module.exports = express();

    /*  Configurando o server */
    app.configure(function () {
        "use strict";

        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.set('view engine', 'ejs');

        /* caso seja ambiente de produção, esconder erros */
        if (config.host.debuglevel === 0) {
            app.use(express.errorHandler({ dumpExceptions: true }));
        }

        app.use(app.router);
    });

    var model = require('./model/Model'),
        auth = require('./utils/auth');
    /*  Chamando controllers */
    require('./controller/Event.js')({
        app      : app,
        model    : model,
        auth     : auth,
        config   : config
    });
    require('./controller/Statistic.js')({
        app      : app,
        model    : model
    });
    require('./controller/Tasks.js')({
        app      : app,
        model    : model,
        auth     : auth,
        config   : config
    });
    require('./controller/Contacts.js')({
        app      : app,
        model    : model,
        auth     : auth,
        config   : config
    });
    require('./controller/Finances.js')({
        app      : app,
        model    : model,
        auth     : auth,
        config   : config
    });
    require('./controller/Utm.js')({
        app      : app,
        model    : model,
        auth     : auth,
        config   : config
    });
    require('./controller/www.js')({
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
        var Model = require('./model/Event.js').Event;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        Model.count(function (error, count) {
            if (error) response.send({error : error});
            else {
                response.send({count : count});
            }
        });
    });

    setInterval(function () {
        'use strict';

        if (process.memoryUsage().heapUsed > 150000000) {
            process.exit();
        }
    }, 30000);

    /*  Ativando o server */
    app.listen(config.host.port);
}
