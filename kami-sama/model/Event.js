/** Event
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Representação da entidade de evento
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    eventSchema,
    Event;

eventSchema = new schema({
    user        : {type : objectId},
    date        : {type : Date},
    label       : {type : String, required : true},
    callback    : {type : String, required : true},
    method      : {type : String, required : true}
});

/*  Exportando o pacote  */
exports.Event = Event = mongoose.model('Events', eventSchema);
