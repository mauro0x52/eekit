/** Account
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Representação de agendamento de email
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    scheduleSchema;

scheduleSchema = new schema({
    user        : {type : objectId, required : true},
    request     : {
        service : {type : String},
        name    : {type : String}
    },
    mail        : {
        from    : {type : String},
        to      : {type : String},
        subject : {type : String},
        html    : {type : String}
    },
    dateCreated : {type : Date},
    date        : {type : Date}
});

/*  Exportando o pacote  */
exports.Schedule = mongoose.model('Schedule', scheduleSchema);