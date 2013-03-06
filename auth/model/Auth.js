/** Auth
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Representação da entidade de autenticação de serviço
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    authSchema;

authSchema = new Schema({
    service : {type : objectId, required : true},
    apps    : [{type : objectId}]
    tokens  : [require('./Token.js').Token]
});

/** addToken
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Gera o token do usuário
 * @param cb : callback a ser chamado após a ativação
 */
authSchema.methods.addToken = function (cb) {
    "use strict";

    var token = crypto
        .createHash('sha256')
        .update(config.security.token + this._id + crypto.randomBytes(10))
        .digest('hex');

    this.tokens.push({
        token       : token,
        dateCreated : new Date(),
        dateUpdated : new Date()
    });

    this.save(function (error) {
        cb(error, token);
    });
};

/** removeToken
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Gera o token do usuário
 * @param tokenKey : token que sera removido
 * @param cb : callback a ser chamado após a desativação
 */
authSchema.methods.removeToken = function (tokenKey, cb) {
    "use strict";

    var i;

    for (i in this.tokens) {
        if (this.tokens[i].token === tokenKey) {
            this.tokens[i] = undefined;
        }
    }

    this.save(function (error) {
        cb(error);
    });
};

/** CheckToken
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since : 2013-02
 *
 * @description : Verifica se o token passado é correto
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.checkToken = function (tokenKey) {
    "use strict";

    var i;

    for (j in this.tokens) {
        if (
            this.tokens[i].token.toString() === tokenKey.toString() &&
            (new Date() - new Date(this.tokens[i].dateUpdated))/(1000*60*60*24) < 30
        ) {
            this.tokens[i].dateUpdated = new Date();
            this.tokens[i].save();
            return true;
        }
    }
    return false;
};

exports.Auth = authSchema;