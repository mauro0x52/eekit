/** User
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2013-02
 *
 * @description : Representação da entidade de usuários
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    userSchema,
    User;

userSchema = new Schema({
    username         : {type : String, trim : true, required : true, unique : true},
    password         : {type : String, required : true},
    dateCreated      : {type : Date},
    auths            : [require('./Auth').Auth]
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o username ainda não foi cadastrado
 */
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.password = User.encryptPassword(this.password);
        this.auths.push({
            service : 'www'
        });
        next();
    } else {
        next();
    }
});

/** encryptPassword
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Encripta um password
 * @param password : password
 */
userSchema.statics.encryptPassword = function (password) {
    "use strict";

    if (password && password != '') {
        password = crypto
            .createHash('sha256')
            .update(config.security.password + password)
            .digest('hex');
    }

    return password;
};

/** findByToken
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Procura um usuário pelo token
 * @param tokenKey : token do usuário
 * @param cb : callback a ser chamado
 */
userSchema.statics.findByToken = function (tokenKey, cb) {
    "use strict";

    if (tokenKey) {
        User.findOne({'auths.tokens.token' : tokenKey}, cb);
    } else {
        cb({ message : 'invalid token', name : 'InvalidTokenError'}, null);
    }
};

/** checkToken
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : valida o token de um usuário
 * @param tokenKey : token do usuário
 * @param serviceKey : serviço do token
 */
userSchema.methods.checkToken = function (tokenKey, serviceKey) {
    "use strict";

    var i, j, token;
    for (i in this.auths) {
        if (this.auths[i].service === serviceKey) {
            for (j in this.auths[i].tokens) {
                token = this.auths[i].tokens[j];
                if (token.token) {
                    if (
                        this.auths[i].tokens[j].token.toString() === tokenKey.toString() &&
                        (new Date() - new Date(this.auths[i].tokens[j].dateUpdated))/(1000*60*60*24) < 30
                    ) {
                        this.auths[i].tokens[j].dateUpdated = new Date();
                        this.save()
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/** login
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since : 2013-02
 *
 * @description : Loga o usuário no sistema
 * @param cb : callback a ser chamado após o usuário ser logado
 */
userSchema.methods.login = function (cb) {
    "use strict";

    var config = require('../config.js');

    this.auth('www', cb);
};

/** logout
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since : 2013-02
 *
 * @description : Desloga o usuário no sistema
 * @param tokenKey : token da seção que será fechada
 * @param cb : callback a ser chamado após o usuário ser deslogado
 */
userSchema.methods.logout = function (tokenKey, cb) {
    "use strict";

    var config = require('../config.js'),
        that = this;

    for (var i in this.auths) {
        if (this.auths[i].service === 'www') {
            var i;

            for (var j in this.auths[i].tokens) {
                if (this.auths[i].tokens[j].token === tokenKey) {
                    this.auths[i].tokens[j].remove();
                }
            }
        }
    }
    this.save(cb);
};

/** auth
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since : 2013-02
 *
 * @description : Loga o usuário em um serviço
 * @param cb : callback a ser chamado após o usuário ser logado
 */
userSchema.methods.auth = function (service, cb) {
    "use strict";

    var i,
        auth,
        token = crypto
            .createHash('sha256')
            .update(config.security.token + this._id + crypto.randomBytes(10))
            .digest('hex');

    for (i in this.auths) {
        if (this.auths[i].service === service) {
            auth = this.auths[i];
        }
    }
    if (!auth) {
        this.auths.push({
            service : service,
            tokens  : [{
                token       : token,
                dateCreated : new Date(),
                dateUpdated : new Date()
            }]
        });

        this.save(function (error) {
            cb(error, token);
        });
    } else {
        auth.tokens.push({
            token       : token,
            dateCreated : new Date(),
            dateUpdated : new Date()
        });

        this.save(function (error) {
            cb(error, token);
        });
    }
};

/*  Exportando o pacote  */
User = exports.User = mongoose.model('Users', userSchema);
