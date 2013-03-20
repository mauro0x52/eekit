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
    type        : {type : String, enum : ['general','meetings','finances','sales','projects','personals']},
    color       : {type : String, enum : ['navy','blue','cyan','green','olive','beige','yellow','gold','orange','red','brown','pink','coral','purple','black','gray']}
});

categorySchema.methods.findTask = function (task_id, cb) {
    Task.findOne({_id : task_id, category : this._id}, cb);
}

/*  Exportando o pacote  */
exports.Category = categorySchema;