/**
 * Controller Billet
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * Módulo que implementa as funcionalidades de boleto
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Billet = Model.Billet;

    /**
     * Cria um novo boleto
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     */
    app.post('/billet', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var billet;

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                var billet = new Billet({
                    user : user._id,
                    bankId : request.param('bankId', null),
                    bank : request.param('bank', null),
                    value : request.param('value', null),
                    receiver : request.param('receiver', null),
                    agency : request.param('agency', null),
                    account : request.param('account', null),
                    accountVD : request.param('accountVD', null),
                    wallet : request.param('wallet', null),
                    ourNumber : request.param('ourNumber', null),
                    documentNumber : request.param('documentNumber', null),
                    cpfCnpj : request.param('cpfCnpj', null),
                    dueDate : request.param('dueDate', null),
                    creationDate : request.param('creationDate', null),
                    payer : request.param('payer', null),
                    demonstrative : request.param('demonstrative', null),
                    local : request.param('local', null),
                    instructions : request.param('instructions', null),
                    clientName : request.param('clientName', null),
                    clientAddress : request.param('clientAddress', null),
                    clientCity : request.param('clientCity', null),
                    clientState : request.param('clientState', null),
                    clientZipCode : request.param('clientZipCode', null),
                    /* banco do brasil */
                    agreement : request.param('agreement', null)
                });

                billet.save(function (error) {
                    if (error) {
                        response.send({ error : error });
                    } else {
                        response.send({ billet : billet });
                    }
                });
            }
        });
    });

    /**
     * Pega informações de um boleto
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     */
    app.get('/billet/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                Billet.findOne({ _id : request.params.id, user : user._id }, function (error, billet) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({billet : billet});
                    }
                });
            }
        });
    });

    /**
     * Imprime um boleto
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     *
     * @param id        identificador do boleto
     * @param barCode   código numérico do boleto
     */
    app.get('/billet/:id/print/:ourNumber', function (request, response) {
        Billet.findOne({ _id : request.params.id, ourNumber : request.params.ourNumber }, function (error, billet) {
            if (error) {
                response.send({error : error});
            } else {
                billet.print(function (error, print) {
                    if (error) {
                        response.send({ error : error });
                    } else {
                        response.render('../view/billet.ejs', print);
                    }
                });
            }
        });
    });

}
