/**
 * Model dos serviços
 *
 * @author : Mauro Ribeiro
 * @since : 2012-10
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    serviceSchema;

serviceSchema = new Schema({
    service : {type : String, required : true},
    apps : [{type : objectId}]
});

/*  Exportando o pacote  */
exports.Service = serviceSchema;