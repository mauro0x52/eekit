/**
 * Contact
 *
 * @author : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Representação da entidade de cliente
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    contactSchema;

contactSchema = new schema({
    company     : {type : objectId, required : true},
    category    : {type : objectId},
    name        : {type : String, trim : true, required : true},
    email       : {type : String},
    phone       : {type : String},
    notes       : {type : String},
    priority    : {type : Number},
    dateCreated : {type : Date},
    fieldValues : [require('./FieldValue').FieldValue]
});

/*  Exportando o pacote  */
exports.Contact = mongoose.model('Contact', contactSchema);