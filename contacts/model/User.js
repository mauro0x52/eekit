/** User
 * @author : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Representação da entidade de etapas de negociação de usuário
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    UserSchema;

UserSchema = new schema({
    user        : objectId,
    categories  : [require('./Category').Category],
    fields      : [require('./Field').Field]
});

UserSchema.methods.findCategory = function (category_id, cb) {
    var category = null,
        i;

    for (i = 0; i < this.categories.length; i++) {
        if (this.categories[i]._id.toString() === category_id) {
            category = this.categories[i];
        }
    }

    cb(undefined, category);
};

UserSchema.methods.findField = function (field_id, cb) {
    var field = null,
        i;

    for (i = 0; i < this.fields.length; i++) {
        if (this.fields[i]._id.toString() === field_id) {
            field = this.fields[i];
        }
    }

    cb(undefined, field);
}

/*  Exportando o pacote  */
exports.User = mongoose.model('User', UserSchema);