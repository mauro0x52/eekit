/** User
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2013-02
 *
 * @description : Representação da entidade de usuários
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Company = require('./Company.js').Company,
    Token = require('./Token.js').Token,
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    userSchema,
    User;

userSchema = new Schema({
    name            : {type : String, trim : true, required : true},
    username        : {type : String, trim : true, required : true, unique : true},
    password        : {type : String, required : true},
    company         : {type : objectId, required : true},
    dateCreated     : {type : Date},
    informations    : {type : Schema.Types.Mixed},
    tokens          : [Token]
});

/**
 * Verifica se o username já existe
 *
 * @author Rafael Erthal
 * @since  2012-08
 */
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.password = User.encryptPassword(this.password);
        next();
    } else {
        next();
    }
});

/**
 * Encripta um password
 *
 * @author Mauro Ribeiro
 * @since  2012-08
 *
 * @param password      senha do brother
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

/**
 * Encontra um usuário pelo seu token
 *
 * @author Rafael Erthal
 * @since  2013-02
 *
 * @param tokenKey  token do usuário
 * @param cb        callback a ser chamado
 */
userSchema.statics.findByToken = function (tokenKey, cb) {
    "use strict";

    if (tokenKey) {
        User.findOne({'tokens.token' : tokenKey}, cb);
    } else {
        cb({ message : 'invalid token', name : 'InvalidTokenError'}, null);
    }
};

/**
 * Verifica se o token é válido
 *
 * @author Rafael Erthal
 * @since  2013-02
 *
 * @param tokenKey      token do usuário
 * @param serviceKey    serviço do token
 */
userSchema.methods.checkToken = function (tokenKey, serviceKey) {
    "use strict";

    var i, j, token, expiration;

    for (i = 0; i < this.tokens.length; i++) {// in this.tokens) {
        expiration = new Date(this.tokens[i].dateExpiration);
        if (
            this.tokens[i].service === serviceKey &&
            this.tokens[i].token.toString() === tokenKey.toString() &&
            (new Date() <= expiration)
        ) {
                this.tokens[i].dateExpiration = expiration.setMinutes(expiration.getMinutes() + 24*60);
                this.save()
                return true;
        }
    }
    return false;
};

/**
 * Loga o usuário em um serviço
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2013-02
 *
 * @param service   serviço para logar
 * @param cb        callback a ser chamado após o usuário ser logado
 */
userSchema.methods.login = function (service, cb) {
    "use strict";

    var i, found, user, token;

    user = this;

    Company.findById(this.company, function (error, company) {
        if (error) {
            cb(error);
        } else {
            // Verifica se a empresa tem autorização para acessar o serviço
            for (i in company.services) {
                if (company.services[i].service === service) {
                    found = company.services[i];
                }
            }
            if (found) {
               // se a empresa tem autorização
               // gera token de 24h
               token = Token.generate(24*60, found.service);

               // salva usuário com novo token
               user.tokens.push(token);
               user.save(function(error) {
                   cb(error, token.token);
               });
            } else {
                // se a empresa não tem autorização
                cb({ message : 'company not authorized in service "'+service+'"', name : 'InvalidServiceError' });
            }
        }
    });
};

/**
 * Desloga o token
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2013-02
 *
 * @param tokenKey  token da seção que será fechada
 * @param cb        callback a ser chamado após o usuário ser deslogado
 */
userSchema.methods.removeToken = function (tokenKey, cb) {
    "use strict";

    for (var i in this.tokens) {
        if (this.tokens[i].token === tokenKey) {
            this.tokens[i].remove();
        }
    }
    this.save(cb);
};

/*  Exportando o pacote  */
User = exports.User = mongoose.model('User', userSchema);