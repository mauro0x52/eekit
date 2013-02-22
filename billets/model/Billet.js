/**
 * Model Billet
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @description : Representação da entidade de boleto
 */

var Itau = require('./Itau.js').Itau;

var Billet = function (params) {
        /* banco */
        this.bank = params.bank;
        this.bankId = params.bankId;
        this.wallet = params.wallet;
        this.currency = '9';
        /* recebedor */
        this.receiver = params.receiver;
        this.cpfCnpj = params.cpfCnpj;
        this.agency = params.agency;
        this.account = params.account;
        this.accountVD = params.accountVD;
        /* documento */
        this.local = params.local || 'Pagável em qualquer Banco até o vencimento';
        this.ourNumber = params.ourNumber;
        this.ourNumberVD = '';
        this.documentNumber = params.documentNumber;
        this.dueDate = new Date(params.dueDate);
        this.creationDate = params.creationDate;
        this.value = params.value.replace('.', ',');
        this.instructions = params.instructions;
        /* cliente */
        this.clientName = params.clientName;
        this.clientAddress = params.clientAddress;
        this.clientCity = params.clientCity;
        this.clientState = params.clientState;
        this.clientZipCode = params.clientZipCode;
        this.demonstrative = params.demonstrative;



    this.print = function (cb) {
        if (this.bankId === '341') {
            Itau.print(this, function (error, print) {
                cb (error, print);
            });
        }
    };
}

/*  Exportando o pacote  */
exports.Billet = Billet;
