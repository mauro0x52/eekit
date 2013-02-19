/** FieldValue
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Representação de valores de campos configuráveis
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    fieldValueSchema;

fieldValueSchema = new schema({
	field : {type : objectId},
    value : {type : String}
});

/*  Exportando o pacote  */
exports.FieldValue = fieldValueSchema;