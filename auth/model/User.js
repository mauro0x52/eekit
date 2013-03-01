/** User
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
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
    tokens           : [require('./Token.js').Token],
    dateCreated      : {type : Date},
    status           : {type : String, required : true, enum : ['active', 'inactive']}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o username ainda não foi cadastrado
 */
userSchema.pre('save', function (next) {
    var i, j, password;

    if (this.isNew) {
        this.password = User.encryptPassword(this.password);
    }
    next();
});

/** findByIdentity
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um usuário pelo id ou pelo username
 * @param id : id ou username do produto
 * @param cb : callback a ser chamado
 */
userSchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        User.findById(id, cb);
    } else {
        // procura por username
        User.findOne({username : id}, cb);
    }
};

/** findByValidToken
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um usuário pelo token e verifica se é válido
 * @param token : token do usuário
 * @param cb : callback a ser chamado
 */
userSchema.statics.findByValidToken = function (tokenKey, cb) {
    "use strict";
    User.findOne({'tokens.token' : tokenKey}, function(error, user) {
        if (error) {
            cb(error);
        } else {
            if (!user) {
                cb({ message : 'Invalid token', name : 'InvalidTokenError'});
            } else {
                user.checkToken(tokenKey, function(valid) {
                    if (valid) {
                        cb(undefined, user);
                    } else {
                        cb({ message : 'Invalid token', name : 'InvalidTokenError'}, user);
                    }
                });
            }
        }
    });
};

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

/** GenerateToken
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Gera o token do usuário
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.generateToken = function () {
    "use strict";

    var token = crypto
        .createHash('sha256')
        .update(config.security.token + this.login + this.password + crypto.randomBytes(10))
        .digest('hex');

    return token;
};

/** CheckToken
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Verifica se o token passado é correo
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.checkToken = function (tokenKey, cb) {
    "use strict";

    var token, i, dateDiff,
        user = this;

    for (i = 0; i < user.tokens.length; i++) {
        // verifica se expirou
        dateDiff = (new Date() - new Date(user.tokens[i].dateUpdated))/(1000*60*60*24);
        if (dateDiff > 30) {
            // se expirou, remove
            user.tokens[i].remove();
        } else if (user.tokens[i].token === tokenKey) {
            // verifica se é o que procura
            token = user.tokens[i];
        }
    }

    if (token) {
        token.dateUpdated = new Date();
        token.save(function() {
            cb(true);
        });
    }

};

/** Activate
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Ativa a conta do usuário
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.activate = function (cb) {
    "use strict";

    this.status = 'active';
    this.save(cb);
};

/** Deactivate
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Desativa a conta do usuário
 * @param cb : callback a ser chamado após a desativação da conta
 */
userSchema.methods.deactivate = function (cb) {
    "use strict";

    this.status = 'inactive';
    this.save(cb);
};

/** Login
 * @author : Mauro Ribeiro
 * @since : 2012-10
 *
 * @description : Loga o usuário no sistema
 * @param cb : callback a ser chamado após o usuário ser logado
 */
userSchema.methods.login = function (cb) {
    "use strict";

    var token = this.generateToken();

    this.tokens.push({
        token       : token,
        dateCreated : new Date(),
        dateUpdated : new Date()
    });

    this.save(function() {
        cb(undefined, token);
    });
};

/** Logout
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Desloga o usuário no sistema
 * @param cb : callback a ser chamado após o usuário ser deslogado
 */
userSchema.methods.logout = function (tokenKey, cb) {
    "use strict";

    var token, i;

    for (i = 0; i < this.tokens.length; i = i + 1) {
        if (this.tokens[i].token === tokenKey) {
            token = this.tokens[i];
        }
    }
    token = undefined;
    this.save(cb);
};

/** ChangePassword
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Muda a senha de um usuário do sistema
 * @param password : nova senha do usuário
 * @param cb : callback a ser chamado após a mudança da senha
 */
userSchema.methods.changePassword = function (password, cb) {
    "use strict";

    password = User.encryptPassword(password);

    this.password = password;
    this.save(cb);
};

/*  Exportando o pacote  */
User = exports.User = mongoose.model('Users', userSchema);
