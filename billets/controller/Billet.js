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


    app.get('/billet', function (request, response) {
        var billet = new Billet({
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
        billet.print(function (error, print) {
            if (error) {
                response.send({ error : error });
            } else {
                response.render('../view/billet.ejs', print);
            }
        })
    });

}
