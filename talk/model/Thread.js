/** Thread
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Representação da entidade thread
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    threadSchema;

threadSchema = new schema({
    talkers   : [{user : objectId, typing : Boolean}],
    messages  : [{message : String, date : Date, sender : objectId, readers : [objectId]}],
    embeddeds : [String]
});

/*  Exportando o pacote  */
exports.Thread = mongoose.model('Thread', threadSchema);