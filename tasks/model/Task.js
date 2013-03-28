/** Task
 * @author : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Representação da entidade de task
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    taskSchema;

taskSchema = new schema({
    company     : {type : objectId, required : true},
    user        : {type : objectId, required : true},
    category    : {type : objectId, required : true},
    title       : {type : String, trim : true, required : true},
    subtitle    : {type : String},
    description : {type : String},
    done        : {type : Boolean},
    important   : {type : Boolean},
    recurrence  : {type : Number},
    priority    : {type : Number},
    embeddeds   : [{type : String, trim : true}],
    reminder    : {type : Number},
    dateCreated : {type : Date},
    dateUpdated : {type : Date},
    dateDeadline: {type : Date}
});

/*  Exportando o pacote  */
exports.Task = mongoose.model('Tasks', taskSchema);