/**
 * Model Billet
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @description : Representação da entidade de boleto
 */

var Itau = require('./Itau.js').Itau,
    Bradesco = require('./Bradesco.js').Bradesco,
    Bb = require('./Bb.js').Bb,
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    billetSchema;

billetSchema = new schema({
    /* usuário */
    user            : { type : objectId, required : true },
    /* banco */
    bank            : { type : String},
    bankId          : { type : String, required : true, 'enum' : ['001', '237', '341']},
    wallet          : { type : String },
    currency        : { type : String, required : true, 'default' : '9'},
    /* recebedor */
    receiver        : { type : String },
    cpfCnpj         : { type : String },
    agency          : { type : String },
    account         : { type : String },
    accountVD       : { type : String },
    /* documento */
    local           : { type : String, 'default' : 'Pagável em qualquer Banco até o vencimento' },
    ourNumber       : { type : String },
    documentNumber  : { type : String },
    dueDate         : { type : Date },
    creationDate    : { type : Date, required : true, 'default' : Date.now },
    value           : { type : Number },
    instructions    : { type : String },
    /* cliente */
    clientName      : { type : String },
    clientAddress   : { type : String },
    clientCity      : { type : String },
    clientState     : { type : String },
    clientZipCode   : { type : String },
    demonstrative   : { type : String },
    /* particularidades banco do brasil */
    agreement       : { type : String }
});

/**
 * Seta alguns dados padrões
 *
 * @author Mauro Ribeiro
 * @since  2013-03-25
 */
billetSchema.pre('save', function (next) {
    if (this.bankId === '001') {
        Bb.validate(this, function (error) {
            next(error);
        });
    } else if (this.bankId === '237') {
        Bradesco.validate(this, function (error) {
            next(error);
        });
    } else if (this.bankId === '341') {
        Itau.validate(this, function (error) {
            next(error);
        });
    } else {
        next();
    }
});

billetSchema.methods.print = function (cb) {
    if (this.bankId === '001') {
        Bb.print(this, function (error, print) {
            cb(error, print);
        });
    } else if (this.bankId === '237') {
        Bradesco.print(this, function (error, print) {
            cb(error, print);
        });
    } else if (this.bankId === '341') {
        Itau.print(this, function (error, print) {
            cb(error, print);
        });
    } else {
        cb(null, null);
    }
}

/*  Exportando o pacote  */
exports.Billet = mongoose.model('Billets', billetSchema);
