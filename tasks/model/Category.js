/** Category
 * @author : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Representação da entidade de categoria
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    Task = require('./Task.js'),
    categorySchema;

categorySchema = new schema({
    name        : {type : String, trim : true, required : true},
    childs      : [objectId]
});

categorySchema.methods.findTask = function (task_id, cb) {
    Task.findOne({_id : task_id, category : this._id}, cb);
}

/*  Exportando o pacote  */
exports.Category = categorySchema;