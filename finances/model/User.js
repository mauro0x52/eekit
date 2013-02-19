/** UserPhases
 * @author : Rafael Erthal
 * @since : 2012-09
 *
 * @description : Representação da entidade de etapas de negociação de usuário
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    userSchema;

userSchema = new schema({
    user        : objectId,
    categories  : [require('./Category').Category],
    accounts    : [require('./Account').Account]
});

userSchema.methods.findCategory = function (category_id, cb) {
    var category = null,
        i;
    
    for (i = 0; i < this.categories.length; i++) {
        if (this.categories[i]._id.toString() === category_id) {
            category = this.categories[i];
        }
    }
    
    cb(undefined, category);
}

userSchema.methods.findAccount = function (account_id, cb) {
    var account = null,
        i;
    
    for (i = 0; i < this.accounts.length; i++) {
        if (this.accounts[i]._id.toString() === account_id) {
            account = this.accounts[i];
        }
    }
    
    cb(undefined, account);
}

/*  Exportando o pacote  */
exports.User = mongoose.model('Users', userSchema);