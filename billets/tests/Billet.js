/** Testes do Billets.Billet
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */

var should = require("should"),
    api = require("./utils.js").api,
    newUser = require("./utils.js").newUser,
    config = require("./../config.js"),
    user, token, date, dueDate, billet;

date = new Date();
dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5);

describe('POST /billet', function () {
    before(function (done) {
        newUser('billets', function (error, newUser){
            if (error) done(error);
            else {
                user = newUser;
                token = user.tokens.billets;
                done();
            }
        })
    });

    it('boleto do Itau', function (done) {
        api.post('billets', '/billet', {
            token : token,
            /* banco */
            bankId          : '341',
            wallet          : '175',
            /* recebedor */
            receiver        : 'Carinha que testa',
            cpfCnpj         : '00.000.000/0000-00',
            agency          : '9999',
            account         : '99999',
            /* documento */
            dueDate         : dueDate,
            creationDate    : date,
            value           : 100.00
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('billet').not.property('error');
                data.should.have.property('billet').property('bank', 'Banco Itaú');
                data.should.have.property('billet').property('bankId', '341');
                data.should.have.property('billet').property('wallet', '175');
                data.should.have.property('billet').property('receiver', 'Carinha que testa');
                data.should.have.property('billet').property('cpfCnpj', '00.000.000/0000-00');
                data.should.have.property('billet').property('agency', '9999');
                data.should.have.property('billet').property('account', '99999');
                data.should.have.property('billet').property('value', 100.00);
                billet = data.billet
                done();
            }
        });
    });
});

describe('GET /billet/:id', function () {
    it('pega os dados do boleto', function (done) {
        api.get('billets', '/billet/'+billet._id, {
            token : token
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('billet').not.property('error');
                data.should.have.property('billet').property('bank', 'Banco Itaú');
                data.should.have.property('billet').property('bankId', '341');
                data.should.have.property('billet').property('wallet', '175');
                data.should.have.property('billet').property('receiver', 'Carinha que testa');
                data.should.have.property('billet').property('cpfCnpj', '00.000.000/0000-00');
                data.should.have.property('billet').property('agency', '9999');
                data.should.have.property('billet').property('account', '99999');
                data.should.have.property('billet').property('value', 100.00);
                done();
            }
        });
    });
});


describe('GET /billet/:id/print/:ourNumber', function () {

    it('imprime o boleto', function (done) {
        console.log('verificar http://'+config.services['billets'].url+':'+config.services['billets'].port + '/billet/'+billet._id+'/print/'+billet.ourNumber);
        done();
    });
});
