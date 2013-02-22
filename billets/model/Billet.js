/**
 * Model Billet
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @description : Representação da entidade de boleto
 */

var Itau = require('./Itau.js').Itau;

var Billet = function (params) {
    this.bankId = params.bankId;
    this.bank = params.bank;
    this.bankIdVD = '';
    this.currency = '9';
    this.value = params.value.replace('.', ',');
    this.receiver = params.receiver;
    this.agency = params.agency;
    this.account = params.account;
    this.accountDV = params.accountDV;
    this.wallet = params.wallet;
    this.ourNumber = params.ourNumber;
    this.ourNumberVD = '';
    this.documentNumber = params.documentNumber;
    this.cpfCnpj = params.cpfCnpj;
    this.dueDate = new Date(params.dueDate);
    this.creationDate = params.creationDate;
    this.demonstrative = params.demonstrative;
    this.local = params.local || 'Pagável em qualquer Banco até o vencimento';
    this.instructions = params.instructions;
    this.clientName = params.clientName;
    this.clientAddress = params.clientAddress;
    this.clientCity = params.clientCity;
    this.clientState = params.clientState;
    this.clientZipCode = params.clientZipCode;

    this.digitCode = '';
    this.barCodeNumber = '';
    this.barCode = '';

    if (this.bankId === '341') {
        Itau.billet(this);
    }
}

/*  Exportando o pacote  */
exports.Billet = Billet;
