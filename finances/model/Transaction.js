/** Transaction
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Representação da transação
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    transactionSchema;

transactionSchema = new schema({
    company     : {type : objectId},
    author      : {type : objectId},
    category    : {type : objectId},
    account     : {type : objectId},
    task        : {type : objectId},
    name        : {type : String, trim : true, required : true},
    subtitle    : {type : String},
    embeddeds   : [{type : String, trim : true}],
    value       : {type : Number, required : true},
    date        : {type : Date, required : true},
    recurrence  : {type : Number},
    noteNumber  : {type : String},
    situation   : {type : String, enum : ['automatic','paid','unpaid']},
    type        : {type : String, enum : ['debt','credit']},
    isTransfer  : {type : Boolean}
});

/*  Exportando o pacote  */
exports.Transaction = mongoose.model('Transaction', transactionSchema);