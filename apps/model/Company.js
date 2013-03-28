/** Company
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Representação da entidade de pagamento empresa
 */

var Source   = require('./Source.js').Source,
    mongoose = require('mongoose'),
    crypto   = require('crypto'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    companySchema;

companySchema = new Schema({
    company     : {type : objectId, required : true},
    app         : {type : objectId, unique : true},
    expiration  : {type : Date, required : true}
});

/*  Exportando o pacote  */
exports.Company = mongoose.model('Company', companySchema);