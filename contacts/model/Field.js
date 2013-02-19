/** Field
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Representação de campos configuraveis
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    fieldSchema;

fieldSchema = new schema({
    name        : {type : String, trim : true, required : true},
    position    : {type : Number}
});

/*  Exportando o pacote  */
exports.Field = fieldSchema;