/** Billet
 *
 * @autor : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Server de boletos
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    //caso seja ambiente de produção, esconder erros
    if(config.host.debuglevel === 0){
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Chamando controllers */
require('./controller/Billet.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request,response) {
    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);