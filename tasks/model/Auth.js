/**
 * Auth
 *
 * @author Mauro Ribeiro
 * @since  2013-06-04
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    authSchema, Auth;

authSchema = new schema({
    token      : {type : String, required : true},
    user       : {_id : {type : objectId, required : true}},
    company    : {_id : {type : objectId, required : true}},
    expiration : {type : Date, required : true}
});

authSchema.index({token : 1});
authSchema.index({'user._id' : 1, expiration : -1});


/**
 * Procura por token
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
authSchema.statics.findByToken = function (tokenkey, cb) {
    "use strict";

    var expiration;

    /* procura o token mais recente */
    Auth.findOne({token : tokenkey}, function (error, auth) {
        if (error || !auth) {
            /* se não tiver, valida no servico auth */
            Auth.tokenServiceCheck(tokenkey, cb)
        } else {
            /* se tem o token localmente, atualiza e retorna */
            expiration = new Date();
            expiration = expiration.setDate(expiration.getDate() + 30);

            auth.expiration = expiration;
            auth.save(function (error) {
                cb(error, auth);
            });
        }
    });
};

/**
 * Valida o token no serviço
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 *
 * @param token     chave relativa ao usuário
 * @param cb        callback a ser chamado
 */
authSchema.statics.tokenServiceCheck = function (token, cb) {
    "use strict";

    var auth = require('../utils/auth');

    auth(token, function (error, data) {
        if (error) {
            cb(error);
        } else if (data.error) {
            cb(data.error);
        } else {
            /* se token existe, salva localmente e retorna */
            var expiration,
                newAuth;

            expiration = new Date();
            expiration = expiration.setDate(expiration.getDate() + 30);

            newAuth = new Auth({
                token      : token,
                user       : {_id : data.user._id},
                company    : {_id : data.company._id},
                expiration : expiration
            });

            newAuth.save(function(error) {
                cb(error, newAuth);
            });
        }
    });
};

/*  Exportando o pacote  */
Auth = exports.Auth = mongoose.model('Auth', authSchema);