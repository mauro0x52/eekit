/** Company
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Representação da entidade de empresa
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    companySchema;

companySchema = new schema({
    company     : objectId,
    categories  : [require('./Category').Category]
});

companySchema.index({company: 1});

companySchema.methods.findCategory = function (category_id, cb) {
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
exports.Company = mongoose.model('Company', companySchema);