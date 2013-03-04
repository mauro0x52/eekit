/**
 * @author : Mauro Ribeiro
 * @since : 2012-10
 *
 * @description : Tokens do usuário
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    tokenSchema;

tokenSchema = new Schema({
    token       : {type : String, trim : true, required : true},
    dateCreated : {type : Date, required : true},
    dateUpdated : {type : Date, required : true}
});

/*  Exportando o pacote  */
exports.Token = tokenSchema;