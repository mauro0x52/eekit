/**
 * Controller Billet
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * Módulo que implementa as funcionalidades de boleto
 */

module.exports = function (params) {
    "use strict";

    /**
     * Cria um novo boleto
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     */
    params.app.post('/billet', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var billet;

        params.auth(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                var billet = new params.model.Billet({
                    user : auth.user._id,
                    company : auth.company._id,
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
     * Edita um novo boleto
     *
     * @author Mauro Ribeiro
     * @since  2013-04
     */
    params.app.post('/billet/:id/update', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                Billet.findById(request.params.id, function (error, billet) {
                    if (error || !billet) {
                        response.send({error : { message : 'billet not found', name : 'NotFoundError'}});
                    } else {
                        billet.bankId = request.param('bankId', billet.bankId);
                        billet.bank = request.param('bank', billet.bank);
                        billet.value = request.param('value', billet.value);
                        billet.receiver = request.param('receiver', billet.receiver);
                        billet.agency = request.param('agency', billet.agency);
                        billet.account = request.param('account', billet.account);
                        billet.accountVD = request.param('accountVD', billet.accountVD);
                        billet.wallet = request.param('wallet', billet.wallet);
                        billet.ourNumber = request.param('ourNumber', billet.ourNumber);
                        billet.documentNumber = request.param('documentNumber', billet.documentNumber);
                        billet.cpfCnpj = request.param('cpfCnpj', billet.cpfCnpj);
                        billet.dueDate = request.param('dueDate', billet.dueDate);
                        billet.creationDate = request.param('creationDate', billet.creationDate);
                        billet.payer = request.param('payer', billet.payer);
                        billet.demonstrative = request.param('demonstrative', billet.demonstrative);
                        billet.local = request.param('local', billet.local);
                        billet.instructions = request.param('instructions', billet.instructions);
                        billet.clientName = request.param('clientName', billet.clientName);
                        billet.clientAddress = request.param('clientAddress', billet.clientAddress);
                        billet.clientCity = request.param('clientCity', billet.clientCity);
                        billet.clientState = request.param('clientState', billet.clientState);
                        billet.clientZipCode = request.param('clientZipCode', billet.clientZipCode);
                        /* banco do brasil */
                        billet.agreement = request.param('agreement', billet.agreement);

                        billet.save(function (error) {
                            if (error) {
                                response.send({ error : error });
                            } else {
                                response.send({ billet : billet });
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * Lista boletos
     *
     * @author Mauro Ribeiro
     * @since  2013-04
     */
    params.app.get('/billets', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                Billet.find({ company : auth.company._id }, function (error, billets) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({billets : billets});
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
    params.app.get('/billet/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Billet.findOne({ _id : request.params.id, company : auth.company._id }, function (error, billet) {
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
     * Remove um boleto
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     */
    params.app.post('/billet/:id/delete', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Billet.findOne({ _id : request.params.id, user : auth.user._id }, function (error, billet) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        billet.remove(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send(null);
                            }
                        });
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
    params.app.get('/billet/:id/print/:ourNumber', function (request, response) {
        params.model.Billet.findOne({ _id : request.params.id, ourNumber : request.params.ourNumber }, function (error, billet) {
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
