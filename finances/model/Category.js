/** Category
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Representação da categoria
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    Transaction = require('./Transaction.js').Transaction,
    categorySchema;

categorySchema = new schema({
    name        : {type : String, trim : true, required : true},
    type        : {type : String, enum : ['debt','credit']},
    editable    : {type : Boolean, default : true}
});

categorySchema.methods.transactions = function (cb) {
    Transaction.find({category : this._id}, cb);
}

categorySchema.methods.findTransaction = function (transaction_id, cb) {
    Transaction.findOne({_id : transaction_id, category : this._id}, cb);
}

/*  Exportando o pacote  */
exports.Category = categorySchema;