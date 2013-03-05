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
require('./controller/Contact.js')(app);
require('./controller/Field.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request,response) {
    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);