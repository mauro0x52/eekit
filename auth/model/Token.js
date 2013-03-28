/**
 * @author : Mauro Ribeiro
 * @since : 2012-10
 *
 * @description : Tokens do usuário
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    tokenSchema,
    Token;

tokenSchema = new Schema({
    token          : {type : String, trim : true},
    service        : {type : String, required : true},
    dateCreated    : {type : Date},
    dateExpiration : {type : Date}
});


/**
 * Cria um token
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 *
 * @param minutes   duração do token
 * @param service   id do serviço
 * @param cb        callback
 */
tokenSchema.generate = function (minutes, service) {
    var token, expiration,
        crypto = require('crypto'),
        config = require('./../config.js');

    expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + minutes);

    token = {
         token : crypto
             .createHash('sha512')
             .update(config.security.token + this._id + crypto.randomBytes(10))
             .digest('base64'),
         service : service,
         dateCreated : new Date(),
         dateExpiration : expiration
    };

    return token;
}

/*  Exportando o pacote  */
Token = exports.Token = tokenSchema;