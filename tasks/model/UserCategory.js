/** UserCategory
 * @author : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Representação da entidade de categorias de usuário
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    userCategorySchema;

userCategorySchema = new schema({
    user        : objectId,
    categories  : [require('./Category').Category]
});

userCategorySchema.methods.findCategory = function (category_id, cb) {
    var category = null,
        i;
    
    for (i = 0; i < this.categories.length; i++) {
        if (this.categories[i]._id.toString() === category_id) {
            category = this.categories[i];
        }
    }
    
    cb(undefined, category);
}

/*  Exportando o pacote  */
exports.UserCategory = mongoose.model('UserCategories', userCategorySchema);