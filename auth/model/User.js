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
    auths            : [require('./Auth')]
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o username ainda não foi cadastrado
 */
userSchema.pre('save', function (next) {
    var Service = require('./Model').Service;

    if (this.isNew) {
        this.password = User.encryptPassword(this.password);
        Service.findOne({slug : 'www'}, function (error, service) {
            if (error) {
                cb(error, null);
            } else {
                this.auths.push({
                    service : service._id
                });
                next();
            }
        });

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

    User.findOne({'auths.tokens.token' : tokenKey}, cb);
};

/** checkToken
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : valida o token de um usuário
 * @param tokenKey : token do usuário
 * @param serviceKey : serviço do token
 */
userSchema.statics.checkToken = function (tokenKey, serviceKey) {
    "use strict";

    var i;

    for (i in this.auths) {
        if (
            this.auths[i].service.toString() === serviceKey.toString() &&
            this.auths[i].checkToken(tokenKey)
        ) {
            return true;
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

    var Service = require('./Model').Service;

    Service.findOne({slug : 'www'}, function (error, service) {
        if (error) {
            cb(error, null);
        } else {
            var i;

            for (i in this.auths) {
                if (this.auths[i].service.toString() === service._id.toString()) {
                    return this.auths[i].addToken(cb);
                }
            }
        }
    });
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

    var Service = require('./Model').Service;

    Service.findOne({slug : 'www'}, function (error, service) {
        if (error) {
            cb(error, null);
        } else {
            var i;

            for (i in this.auths) {
                if (this.auths[i].service.toString() === service._id.toString()) {
                    return this.auths[i].removeToken(tokenKey, cb);
                }
            }
        }
    });
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

    var Service = require('./Model').Service;

    Service.findById(service, function (error, service) {
        if (error) {
            cb(error, null);
        } else {
            var i;

            for (i in this.auths) {
                if (this.auths[i].service.toString() === service._id.toString()) {
                    return this.auths[i].addToken(cb);
                }
            }
            this.auths.push({
                service : service._id
            });
        }
    });
};

/*  Exportando o pacote  */
User = exports.User = mongoose.model('Users', userSchema);
