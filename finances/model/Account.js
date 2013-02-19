/** Account
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Representação da conta
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    Transaction = require('./Transaction.js').Transaction,
    accountSchema;

accountSchema = new schema({
    name           : {type : String, trim : true, required : true},
    bank           : {type : String},
    account        : {type : String},
    agency         : {type : String},
    initialBalance : {type : Number},
    initialDate    : {type : Date}
});

accountSchema.methods.transactions = function (cb) {
    Transaction.find({accountId : this._id}, cb);
}

accountSchema.methods.findTransaction = function (transaction_id, cb) {
    Transaction.findOne({_id : transaction_id, accountId : this._id}, cb);
}

/*  Exportando o pacote  */
exports.Account = accountSchema;