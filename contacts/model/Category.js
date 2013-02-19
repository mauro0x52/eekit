/**
 * Category
 * @author : Mauro Ribeiro
 * @since  : 2013-02
 *
 * @description : Representação da categoria do contato
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    Contact = require('./Contact.js'),
    categorySchema;

categorySchema = new schema({
    name        : {type : String, trim : true, required : true},
    type        : {type : String, enum : ['clients','suppliers','partners','personals']},
    color       : {type : String, enum : ['navy','blue','cyan','green','olive','beige','yellow','gold','orange','red','brown','pink','coral','purple','black','gray']}
});

categorySchema.methods.findContact = function (contact_id, cb) {
    Contact.findOne({_id : contact_id, category : this._id}, cb);
}

/*  Exportando o pacote  */
exports.Category = categorySchema;