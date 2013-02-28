/** Payer
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Representação da entidade de Usuário pagante
 */

var Source   = require('./Source.js').Source,
    mongoose = require('mongoose'),
    crypto   = require('crypto'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    payerSchema;

payerSchema = new Schema({
    user        : {type : objectId, required : true},
    app         : {type : objectId, unique : true},
    expiration  : {type : Date, required : true}
});

/*  Exportando o pacote  */
exports.Payer = mongoose.model('Payers', payerSchema);