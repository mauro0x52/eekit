/**
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Serviço autorizados a conversar com familia da APIs da empreendemia
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    serviceSchema;

serviceSchema = new Schema({
    slug        : {type : String, trim : true, unique : true},
    secret      : {type : String, trim : true, required : true},
    url         : {type : String, trim : true, required : true},
    permissions : {
        users     : {type : Boolean, required : true, default : false},
        username  : {type : Boolean, required : true, default : false},
        tokens    : {type : Boolean, required : true, default : false}
    }
});

/*  Exportando o pacote  */
exports.Service = mongoose.model('Services', serviceSchema);