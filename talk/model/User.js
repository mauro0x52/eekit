/** User
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Representação da entidade usuário
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    userSchema;

userSchema = new schema({
    user    : objectId,
    company : objectId,
    session : String,
    alias   : String,
    status  : {type : String, enum : ['online','offline','idle']}
});

/*  Exportando o pacote  */
exports.User = mongoose.model('User', userSchema);